import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess } from "@/lib/api-response";
import { db } from "@ode/database";
import { MODULE_NAMES } from "@ode/shared";

export const GET = (req: NextRequest) =>
  withAuth(req, async (_req, ctx) => {
    const [allModules, tenantModules] = await Promise.all([
      db.module.findMany({ where: { isActive: true }, orderBy: { key: "asc" } }),
      db.tenantModule.findMany({
        where: { tenantId: ctx.tenantId },
        select: { moduleId: true, isActive: true, expiresAt: true, usageCount: true, usageLimit: true },
      }),
    ]);

    const tenantModuleMap = new Map(tenantModules.map((tm) => [tm.moduleId, tm]));

    const modules = allModules.map((m) => {
      const tm = tenantModuleMap.get(m.id);
      const displayNames = MODULE_NAMES[m.key] ?? { en: m.name, ar: m.name, color: "#8b5cf6" };
      return {
        id: m.id,
        key: m.key,
        name: m.name,
        nameAr: displayNames.ar,
        description: m.description,
        color: displayNames.color,
        active: tm?.isActive ?? false,
        expiresAt: tm?.expiresAt ?? null,
        usageCount: tm?.usageCount ?? 0,
        usageLimit: tm?.usageLimit ?? null,
      };
    });

    return apiSuccess({ modules });
  });
