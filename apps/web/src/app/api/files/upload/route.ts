import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError } from "@/lib/api-response";
import { db } from "@ode/database";
import { getPresignedUploadUrl, ALLOWED_MIME_TYPES } from "@ode/storage";
import { z } from "zod";

const schema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive(),
  module: z.string().optional(),
});

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = schema.safeParse(body);
    if (!parse.success) return apiError("بيانات غير صالحة", 400);

    const { filename, contentType, size, module } = parse.data;

    const moduleKey = (module ?? "REPORTING_AI") as keyof typeof ALLOWED_MIME_TYPES;
    const allowedTypes = ALLOWED_MIME_TYPES[moduleKey] ?? [];
    if (!allowedTypes.includes(contentType)) {
      return apiError(`نوع الملف غير مدعوم. الأنواع المقبولة: ${allowedTypes.join(", ")}`, 400);
    }

    const { uploadUrl, key } = await getPresignedUploadUrl({
      tenantId: ctx.tenantId,
      filename,
      mimeType: contentType,
      moduleKey,
    });

    const file = await db.file.create({
      data: {
        tenantId: ctx.tenantId,
        uploadedById: ctx.userId,
        name: filename,
        mimeType: contentType,
        size,
        storageKey: key,
        module: moduleKey as any,
      },
    });

    return apiSuccess({ fileId: file.id, uploadUrl, key });
  });
