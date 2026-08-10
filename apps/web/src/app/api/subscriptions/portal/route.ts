import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createBillingPortal } from "@ode/billing";
import { db } from "@ode/database";

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const tenant = await db.tenant.findUnique({
      where: { id: ctx.tenantId },
      select: { stripeCustomerId: true },
    });

    if (!tenant?.stripeCustomerId) {
      return apiError("لا يوجد اشتراك Stripe مرتبط بهذا الحساب", 400);
    }

    const origin = authReq.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const session = await createBillingPortal(
      tenant.stripeCustomerId,
      `${origin}/dashboard/billing`
    );

    return apiSuccess({ url: session.url });
  }, { permission: "billing.manage" });
