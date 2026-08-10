import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError } from "@/lib/api-response";
import { PERMISSIONS } from "@ode/permissions";
import { ModuleKey, FileStatus, AmazonReportType } from "@prisma/client";
import type { RouteContext } from "@/lib/auth-middleware";

// GET — list uploads for an account
export const GET = withAuth(
  async ({ auth, req }: RouteContext) => {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    if (!accountId) return apiError("accountId مطلوب");

    // Verify account belongs to tenant
    const account = await prisma.amazonAccount.findFirst({
      where: { id: accountId, tenantId: auth.tenantId },
    });
    if (!account) return apiError("حساب أمازون غير موجود", 404);

    const uploads = await prisma.amazonUpload.findMany({
      where: { amazonAccountId: accountId },
      include: { file: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess(uploads);
  },
  { module: ModuleKey.AMAZON_AI, permission: PERMISSIONS.AMAZON_UPLOAD }
);

const createUploadSchema = z.object({
  amazonAccountId: z.string().uuid(),
  fileId: z.string().uuid(),
  reportType: z.nativeEnum(AmazonReportType),
  dateRangeStart: z.string().optional(),
  dateRangeEnd: z.string().optional(),
});

// POST — register a new upload
export const POST = withAuth(
  async ({ auth, req }: RouteContext) => {
    const body = await req.json();
    const parsed = createUploadSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { amazonAccountId, fileId, reportType, dateRangeStart, dateRangeEnd } = parsed.data;

    // Verify ownership
    const account = await prisma.amazonAccount.findFirst({
      where: { id: amazonAccountId, tenantId: auth.tenantId },
    });
    if (!account) return apiError("حساب أمازون غير موجود أو غير مصرح", 404);

    const file = await prisma.file.findFirst({
      where: { id: fileId, tenantId: auth.tenantId },
    });
    if (!file) return apiError("الملف غير موجود", 404);

    const upload = await prisma.amazonUpload.create({
      data: {
        amazonAccountId,
        fileId,
        reportType,
        dateRangeStart: dateRangeStart ? new Date(dateRangeStart) : undefined,
        dateRangeEnd: dateRangeEnd ? new Date(dateRangeEnd) : undefined,
        status: FileStatus.PENDING,
      },
    });

    // Audit
    void prisma.auditLog.create({
      data: {
        actorUserId: auth.userId,
        tenantId: auth.tenantId,
        action: "amazon.upload.create",
        entityType: "AmazonUpload",
        entityId: upload.id,
        newValues: { reportType, fileId },
      },
    });

    return apiSuccess(upload, 201);
  },
  { module: ModuleKey.AMAZON_AI, permission: PERMISSIONS.AMAZON_UPLOAD }
);
