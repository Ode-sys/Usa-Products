import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { hashPassword, validatePasswordStrength } from "@ode/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { TenantType, TenantStatus, UserStatus, MembershipRole, MembershipStatus } from "@prisma/client";
import { generateSlug } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
  fullName: z.string().min(2, "الاسم مطلوب").max(255),
  organizationName: z.string().min(2, "اسم المنظمة مطلوب").max(255),
  phone: z.string().optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { email, password, fullName, organizationName, phone, locale } = parsed.data;

    // Validate password strength
    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) return apiError(pwCheck.message!, 422);

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return apiError("هذا البريد الإلكتروني مسجل مسبقًا", 409);

    const passwordHash = await hashPassword(password);
    const slug = generateSlug(organizationName);
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

    // Create tenant + user + membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: organizationName,
          slug: uniqueSlug,
          type: TenantType.CLIENT,
          status: TenantStatus.ACTIVE,
        },
      });

      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          fullName,
          passwordHash,
          phone,
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(), // MVP: auto-verify, add email verify later
          locale,
        },
      });

      // Get CLIENT_ADMIN role
      const role = await tx.role.findUnique({ where: { name: "CLIENT_ADMIN" } });

      await tx.membership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: MembershipRole.CLIENT_ADMIN,
          roleId: role?.id,
          status: MembershipStatus.ACTIVE,
          joinedAt: new Date(),
        },
      });

      // Activate trial modules (Amazon AI + Reporting AI by MVP default)
      const trialModules = await tx.module.findMany({
        where: { key: { in: ["AMAZON_AI", "REPORTING_AI"] } },
      });

      for (const mod of trialModules) {
        await tx.tenantModule.create({
          data: {
            tenantId: tenant.id,
            moduleId: mod.id,
            status: "TRIAL",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
            limits: { ai_requests_month: 20, file_uploads_month: 5 },
          },
        });
      }

      // Audit
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          tenantId: tenant.id,
          action: "auth.register",
          newValues: { email, organizationName },
          ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
          severity: "info",
        },
      });

      return { user, tenant };
    });

    return apiSuccess({
      message: "تم إنشاء الحساب بنجاح! سجّل دخولك الآن.",
      userId: result.user.id,
      tenantSlug: result.tenant.slug,
    }, 201);
  } catch (error) {
    console.error("Register error:", error);
    return apiError("خطأ في إنشاء الحساب، حاول مرة أخرى", 500);
  }
}
