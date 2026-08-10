import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";
import { createCheckoutSession } from "@ode/billing";
import { db } from "@ode/database";
import { z } from "zod";

const schema = z.object({ planId: z.string().min(1) });

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = schema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const { planId } = parse.data;

    const plan = await db.plan.findFirst({ where: { id: planId, isActive: true } });
    if (!plan) return apiError("الخطة غير موجودة", 404);

    const tenant = await db.tenant.findUnique({
      where: { id: ctx.tenantId },
      select: { id: true, stripeCustomerId: true, name: true },
    });
    if (!tenant) return apiError("المستأجر غير موجود", 404);

    const user = await db.user.findUnique({
      where: { id: ctx.userId },
      select: { email: true, fullName: true },
    });
    if (!user) return apiError("المستخدم غير موجود", 404);

    const origin = authReq.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      tenantId: ctx.tenantId,
      planId: plan.id,
      stripePriceId: plan.stripePriceId ?? "",
      customerEmail: user.email,
      successUrl: `${origin}/dashboard/billing?success=1`,
      cancelUrl: `${origin}/dashboard/billing?cancelled=1`,
    });

    return apiSuccess({ url: session.url });
  }, { permission: "billing.manage" });
