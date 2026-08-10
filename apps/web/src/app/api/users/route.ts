import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess } from "@/lib/api-response";
import { db } from "@ode/database";
import { getPaginationOffset } from "@ode/shared";

export const GET = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const { searchParams } = new URL(authReq.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const status = searchParams.get("status") ?? undefined;

    const where = {
      tenantId: ctx.tenantId,
      ...(status ? { status: status as any } : {}),
    };

    const [memberships, total] = await Promise.all([
      db.membership.findMany({
        where,
        ...getPaginationOffset({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, email: true, avatarUrl: true, status: true, lastLoginAt: true } },
        },
      }),
      db.membership.count({ where }),
    ]);

    const items = memberships.map((m) => ({
      membershipId: m.id,
      role: m.role,
      status: m.status,
      joinedAt: m.createdAt,
      user: m.user,
    }));

    return apiSuccess({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  }, { permission: "users.manage" });
