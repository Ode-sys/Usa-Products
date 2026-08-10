// ============================================================
// API Auth Middleware — validates JWT + tenant + module + permission
// ============================================================

import { NextRequest } from "next/server";
import { extractBearerToken, verifyAccessToken, buildAuthContext } from "@ode/auth";
import { hasPermission, hasModuleAccess, type PermissionKey, type AuthContext } from "@ode/permissions";
import { prisma } from "@ode/database";
import { ModuleKey } from "@prisma/client";
import { apiUnauthorized, apiForbidden } from "./api-response";

export interface RouteContext {
  auth: AuthContext;
  req: NextRequest;
}

type RouteHandler = (ctx: RouteContext, ...args: unknown[]) => Promise<Response>;

interface ProtectOptions {
  permission?: PermissionKey;
  module?: ModuleKey;
}

export function withAuth(handler: RouteHandler, opts: ProtectOptions = {}) {
  return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
    // 1. Extract & verify token
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) return apiUnauthorized("يلزم تسجيل الدخول");

    const payload = verifyAccessToken(token);
    if (!payload) return apiUnauthorized("الجلسة منتهية أو رمز غير صالح");

    // 2. Build auth context
    const auth = buildAuthContext(payload);

    // 3. Check tenant membership is still active
    const membership = await prisma.membership.findFirst({
      where: { userId: auth.userId, tenantId: auth.tenantId, status: "ACTIVE" },
    });
    if (!membership) return apiUnauthorized("العضوية غير نشطة");

    // 4. Fetch active module access for tenant
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId: auth.tenantId, status: { in: ["ACTIVE", "TRIAL"] } },
      include: { module: true },
    });
    auth.moduleAccess = tenantModules.map((tm) => tm.module.key);

    // 5. Check module access
    if (opts.module && !hasModuleAccess(auth, opts.module)) {
      return apiForbidden("هذه الوحدة غير مفعّلة لحسابك. فعّلها من سوق الوحدات.");
    }

    // 6. Check permission
    if (opts.permission && !hasPermission(auth, opts.permission)) {
      return apiForbidden("ليس لديك صلاحية لهذا الإجراء");
    }

    // 7. Log sensitive actions
    if (req.method !== "GET") {
      void prisma.auditLog.create({
        data: {
          actorUserId: auth.userId,
          tenantId: auth.tenantId,
          action: `${req.method} ${new URL(req.url).pathname}`,
          ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
          userAgent: req.headers.get("user-agent") ?? undefined,
          severity: "info",
        },
      });
    }

    return handler({ auth, req }, ...args);
  };
}
