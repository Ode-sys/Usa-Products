import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";
import { db } from "@ode/database";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "CANCELLED"]).optional(),
  domain: z.string().optional().nullable(),
});

export const GET = (req: NextRequest, { params }: { params: { id: string } }) =>
  withAuth(req, async (_req, _ctx) => {
    const tenant = await db.tenant.findUnique({
      where: { id: params.id },
      include: {
        memberships: { include: { user: { select: { id: true, fullName: true, email: true, status: true } } } },
        tenantModules: { include: { module: true } },
        subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 3 },
      },
    });

    if (!tenant) return apiError("المستأجر غير موجود", 404);
    return apiSuccess({ tenant });
  }, { permission: "platform.manage" });

export const PATCH = (req: NextRequest, { params }: { params: { id: string } }) =>
  withAuth(req, async (authReq, _ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = updateSchema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const tenant = await db.tenant.update({ where: { id: params.id }, data: parse.data });
    return apiSuccess({ tenant });
  }, { permission: "platform.manage" });
