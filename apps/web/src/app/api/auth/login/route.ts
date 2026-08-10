import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { verifyPassword, createTokenPair, getRefreshTokenExpiry } from "@ode/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api-response";
import { UserStatus, MembershipStatus } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  tenantSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { email, password, tenantSlug } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          where: { status: MembershipStatus.ACTIVE },
          include: {
            tenant: true,
            roleRef: { include: { rolePermissions: { include: { permission: true } } } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!user || !user.passwordHash) return apiUnauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    if (user.status === UserStatus.SUSPENDED) return apiError("حسابك موقوف، تواصل مع الدعم", 403);
    if (user.status === UserStatus.DELETED) return apiUnauthorized("الحساب غير موجود");

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return apiUnauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");

    // Pick membership: prefer tenantSlug if provided, else first active
    let membership = user.memberships[0];
    if (tenantSlug) {
      const bySlug = user.memberships.find((m) => m.tenant.slug === tenantSlug);
      if (bySlug) membership = bySlug;
    }
    if (!membership) return apiError("لا يوجد حساب نشط مرتبط بهذا البريد", 403);

    // Fetch module access
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId: membership.tenantId, status: { in: ["ACTIVE", "TRIAL"] } },
      include: { module: true },
    });

    const tokens = createTokenPair({
      sub: user.id,
      tenantId: membership.tenantId,
      role: membership.role,
      agencyId: membership.agencyId,
      clientId: membership.clientId,
      moduleAccess: tenantModules.map((tm) => tm.module.key),
    });

    // Store refresh token in DB
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: tokens.accessToken.slice(-64),
        refreshToken: tokens.refreshToken,
        expiresAt: getRefreshTokenExpiry(),
        ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });

    // Update last login
    void prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: req.headers.get("x-forwarded-for") ?? undefined },
    });

    // Audit log
    void prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        tenantId: membership.tenantId,
        action: "auth.login",
        ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
        severity: "info",
      },
    });

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: membership.role,
        tenantId: membership.tenantId,
        tenantSlug: membership.tenant.slug,
        tenantName: membership.tenant.name,
        moduleAccess: tenantModules.map((tm) => tm.module.key),
        locale: user.locale,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("خطأ في الخادم، حاول مرة أخرى", 500);
  }
}
