import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiValidationError } from "@/lib/api-response";
import { db } from "@ode/database";
import { getPaginationOffset } from "@ode/shared";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  type: z.enum(["CLIENT", "AGENCY"]).default("CLIENT"),
  domain: z.string().optional(),
});

export const GET = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const { searchParams } = new URL(authReq.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "25", 10));
    const type = searchParams.get("type") as "CLIENT" | "AGENCY" | null;
    const status = searchParams.get("status") as any;

    const where = {
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    };

    const [tenants, total] = await Promise.all([
      db.tenant.findMany({
        where,
        ...getPaginationOffset({ page, limit }),
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, slug: true, type: true, status: true, createdAt: true,
          _count: { select: { memberships: true } },
          subscriptions: { where: { status: "ACTIVE" }, select: { plan: { select: { name: true } } }, take: 1 },
        },
      }),
      db.tenant.count({ where }),
    ]);

    const items = tenants.map((t) => ({
      ...t,
      userCount: t._count.memberships,
      plan: t.subscriptions[0]?.plan?.name ?? null,
    }));

    return apiSuccess({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  }, { permission: "platform.manage" });

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, _ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = createSchema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const tenant = await db.tenant.create({ data: parse.data });
    return apiSuccess({ tenant }, 201);
  }, { permission: "platform.manage" });
