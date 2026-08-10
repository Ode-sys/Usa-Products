// ============================================================
// Odé AI Platform — Billing (Stripe)
// ============================================================

import Stripe from "stripe";
import { prisma } from "@ode/database";
import { BillingProvider, SubscriptionStatus, InvoiceStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
});

// ─── Customer Management ──────────────────────────────────────

export async function getOrCreateStripeCustomer(tenantId: string, email: string, name: string): Promise<string> {
  const existing = await prisma.subscription.findFirst({
    where: { tenantId, providerCustomerId: { not: null } },
    select: { providerCustomerId: true },
  });
  if (existing?.providerCustomerId) return existing.providerCustomerId;

  const customer = await stripe.customers.create({ email, name, metadata: { tenantId } });
  return customer.id;
}

// ─── Checkout Session ─────────────────────────────────────────

export async function createCheckoutSession(params: {
  tenantId: string;
  planId: string;
  stripePriceId: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(params.tenantId, params.customerEmail, params.customerName);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.stripePriceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { tenantId: params.tenantId, planId: params.planId },
    subscription_data: { metadata: { tenantId: params.tenantId, planId: params.planId } },
    allow_promotion_codes: true,
  });

  return session.url!;
}

// ─── Portal ───────────────────────────────────────────────────

export async function createBillingPortal(customerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

// ─── Webhook Handler ──────────────────────────────────────────

export async function handleStripeWebhook(body: string, signature: string): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoiceFailure(invoice);
      break;
    }
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { tenantId, planId } = session.metadata ?? {};
  if (!tenantId || !planId) return;

  const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return;

  await prisma.subscription.create({
    data: {
      tenantId,
      planId,
      provider: BillingProvider.STRIPE,
      providerSubscriptionId: stripeSubscription.id,
      providerCustomerId: session.customer as string,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  });

  // Activate plan modules for tenant
  const planModules = await prisma.planModule.findMany({ where: { planId }, include: { module: true } });
  for (const pm of planModules) {
    await prisma.tenantModule.upsert({
      where: { tenantId_moduleId: { tenantId, moduleId: pm.moduleId } },
      update: { status: "ACTIVE", limits: pm.limits, activatedAt: new Date() },
      create: { tenantId, moduleId: pm.moduleId, status: "ACTIVE", limits: pm.limits, activatedAt: new Date() },
    });
  }

  void prisma.auditLog.create({
    data: { tenantId, action: "billing.subscription.created", newValues: { planId, provider: "STRIPE" }, severity: "info" },
  });
}

async function syncSubscription(stripeSubscription: Stripe.Subscription) {
  const { tenantId } = stripeSubscription.metadata;
  if (!tenantId) return;

  const status = mapStripeStatus(stripeSubscription.status);

  await prisma.subscription.updateMany({
    where: { providerSubscriptionId: stripeSubscription.id },
    data: {
      status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined,
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.metadata?.tenantId) return;
  await prisma.invoice.create({
    data: {
      tenantId: invoice.metadata.tenantId,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: InvoiceStatus.PAID,
      providerInvoiceId: invoice.id,
      invoiceUrl: invoice.hosted_invoice_url ?? undefined,
      pdfUrl: invoice.invoice_pdf ?? undefined,
      issuedAt: new Date(invoice.created * 1000),
      paidAt: new Date(),
    },
  });
}

async function handleInvoiceFailure(invoice: Stripe.Invoice) {
  if (!invoice.metadata?.tenantId) return;
  await prisma.subscription.updateMany({
    where: { tenantId: invoice.metadata.tenantId, status: SubscriptionStatus.ACTIVE },
    data: { status: SubscriptionStatus.PAST_DUE },
  });
}

function mapStripeStatus(status: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active:   SubscriptionStatus.ACTIVE,
    canceled: SubscriptionStatus.CANCELED,
    past_due: SubscriptionStatus.PAST_DUE,
    trialing: SubscriptionStatus.TRIALING,
    paused:   SubscriptionStatus.PAUSED,
  };
  return map[status] ?? SubscriptionStatus.INCOMPLETE;
}

export { stripe };
