import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { verifyRefreshToken, createTokenPair, getRefreshTokenExpiry } from "@ode/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api-response";
import { MembershipStatus } from "@prisma/client";

const schema = z.object({ refreshToken: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError("Refresh token مطلوب", 422);

    const { refreshToken } = parsed.data;

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return apiUnauthorized("Refresh token منتهي أو غير صالح");

    // Verify session in DB
    const session = await prisma.userSession.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.userSession.delete({ where: { id: session.id } });
      return apiUnauthorized("الجلسة منتهية، سجّل دخولك مجددًا");
    }

    // Get current membership
    const membership = await prisma.membership.findFirst({
      where: { userId: payload.sub, status: MembershipStatus.ACTIVE },
      orderBy: { createdAt: "asc" },
    });
    if (!membership) return apiUnauthorized("لا توجد عضوية نشطة");

    // Get module access
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId: membership.tenantId, status: { in: ["ACTIVE", "TRIAL"] } },
      include: { module: true },
    });

    const tokens = createTokenPair({
      sub: payload.sub,
      tenantId: membership.tenantId,
      role: membership.role,
      agencyId: membership.agencyId,
      clientId: membership.clientId,
      moduleAccess: tenantModules.map((tm) => tm.module.key),
    });

    // Update session with new tokens
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        token: tokens.accessToken.slice(-64),
        refreshToken: tokens.refreshToken,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return apiSuccess(tokens);
  } catch (error) {
    console.error("Refresh error:", error);
    return apiError("خطأ في الخادم", 500);
  }
}
