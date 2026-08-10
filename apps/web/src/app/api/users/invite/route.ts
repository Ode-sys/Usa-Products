import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";
import { db } from "@ode/database";
import { hashPassword } from "@ode/auth";
import { z } from "zod";
import { nanoid } from "nanoid";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  role: z.enum(["CLIENT_USER", "VIEWER", "AGENCY_STAFF", "BILLING_MANAGER", "SUPPORT_AGENT"]),
  fullName: z.string().min(2).optional(),
});

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = schema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const { email, role, fullName } = parse.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      const existingMembership = await db.membership.findFirst({
        where: { userId: existing.id, tenantId: ctx.tenantId },
      });
      if (existingMembership) return apiError("المستخدم عضو بالفعل في هذا الحساب", 409);

      await db.membership.create({
        data: {
          userId: existing.id,
          tenantId: ctx.tenantId,
          role: role as any,
          status: "INVITED",
        },
      });

      return apiSuccess({ message: "تمت الدعوة", userId: existing.id }, 201);
    }

    const tempPassword = nanoid(16);
    const hashedPassword = await hashPassword(tempPassword);

    const user = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName: fullName ?? email.split("@")[0],
        status: "PENDING",
        memberships: {
          create: {
            tenantId: ctx.tenantId,
            role: role as any,
            status: "INVITED",
          },
        },
      },
    });

    return apiSuccess({ message: "تمت الدعوة بنجاح", userId: user.id }, 201);
  }, { permission: "users.invite" });
