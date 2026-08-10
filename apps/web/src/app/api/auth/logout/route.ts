import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { apiSuccess, apiError } from "@/lib/api-response";

const schema = z.object({ refreshToken: z.string().optional() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { refreshToken } = schema.parse(body);

    if (refreshToken) {
      await prisma.userSession.deleteMany({ where: { refreshToken } });
    }

    return apiSuccess({ message: "تم تسجيل الخروج بنجاح" });
  } catch {
    return apiError("خطأ في تسجيل الخروج", 500);
  }
}
