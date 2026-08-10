import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@ode/database";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError } from "@/lib/api-response";
import { PERMISSIONS } from "@ode/permissions";
import { ModuleKey, ReportStatus } from "@prisma/client";
import { runAgent } from "@ode/ai";
import { checkAIUsageLimit } from "@ode/ai";
import type { RouteContext } from "@/lib/auth-middleware";

const generateSchema = z.object({
  amazonAccountId: z.string().uuid(),
  uploadId: z.string().uuid(),
  reportType: z.enum(["WBR", "ASIN_PERFORMANCE", "PROFIT_LOSS", "INVENTORY_FORECAST", "ADS_ANALYSIS"]),
  dateRange: z.object({ start: z.string(), end: z.string() }).optional(),
});

export const POST = withAuth(
  async ({ auth, req }: RouteContext) => {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.errors[0].message, 422);

    const { amazonAccountId, uploadId, reportType } = parsed.data;

    // Verify ownership
    const upload = await prisma.amazonUpload.findFirst({
      where: {
        id: uploadId,
        amazonAccount: { tenantId: auth.tenantId, id: amazonAccountId },
      },
      include: { amazonAccount: true, file: true },
    });
    if (!upload) return apiError("الرفع غير موجود أو غير مصرح", 404);
    if (!upload.parsedData) return apiError("لم تكتمل معالجة الملف بعد", 400);

    // Check AI usage limits
    const tenantModule = await prisma.tenantModule.findFirst({
      where: { tenantId: auth.tenantId, module: { key: ModuleKey.AMAZON_AI } },
    });
    const limit = (tenantModule?.limits as Record<string, number>)?.ai_requests_month ?? 100;
    const { allowed, used } = await checkAIUsageLimit(auth.tenantId, ModuleKey.AMAZON_AI, limit);
    if (!allowed) return apiError(`تجاوزت حد الطلبات الشهري (${used}/${limit})، رقّ إلى خطة أعلى`, 429);

    // Create report record
    const report = await prisma.report.create({
      data: {
        tenantId: auth.tenantId,
        moduleKey: ModuleKey.AMAZON_AI,
        title: `${reportType} — ${upload.amazonAccount.sellerName}`,
        reportType,
        status: ReportStatus.GENERATING,
        createdBy: auth.userId,
        metadata: { amazonAccountId, uploadId },
      },
    });

    // Run AI analysis asynchronously (in production: push to BullMQ queue)
    void generateReport(report.id, upload.parsedData, reportType, auth.tenantId, auth.userId);

    return apiSuccess({ reportId: report.id, status: "GENERATING" }, 202);
  },
  { module: ModuleKey.AMAZON_AI, permission: PERMISSIONS.AMAZON_REPORT_GENERATE }
);

async function generateReport(
  reportId: string,
  parsedData: object,
  reportType: string,
  tenantId: string,
  userId: string
) {
  try {
    const prompt = buildReportPrompt(reportType, parsedData);

    const content = await runAgent("AMAZON_AGENT", prompt, {
      tenantId,
      userId,
      moduleKey: ModuleKey.AMAZON_AI,
      model: "gpt-4o",
      maxTokens: 4000,
    });

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.READY,
        data: { content, generatedAt: new Date().toISOString() },
        summary: content.slice(0, 500),
      },
    });
  } catch (error) {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.FAILED,
        data: { error: error instanceof Error ? error.message : "Unknown error" },
      },
    });
  }
}

function buildReportPrompt(reportType: string, data: object): string {
  const dataStr = JSON.stringify(data, null, 2).slice(0, 8000);

  const prompts: Record<string, string> = {
    WBR: `حلّل بيانات Amazon أدناه وأنتج تقرير WBR (Weekly Business Review) شاملاً بالعربية يتضمن:
1. ملخص الأداء العام للأسبوع
2. المقاييس الرئيسية: المبيعات، الوحدات، العائد، التحويل
3. المنتجات الأعلى أداءً والأقل أداءً
4. الاتجاهات مقارنة بالفترة السابقة
5. توصيات عملية ومحددة للأسبوع القادم

البيانات:\n${dataStr}`,

    ASIN_PERFORMANCE: `حلّل أداء ASINs في البيانات التالية وأنتج تقريرًا بالعربية يتضمن:
1. تصنيف ASINs حسب الأداء (ممتاز / جيد / يحتاج تحسين)
2. مؤشرات كل ASIN: مبيعات، وحدات، سعر، مخزون
3. فرص التحسين لكل ASIN
4. المنتجات المهددة بنفاد المخزون

البيانات:\n${dataStr}`,

    PROFIT_LOSS: `حلّل بيانات الأرباح والخسائر وأنتج تقريرًا ماليًا دقيقًا بالعربية:
1. إجمالي الإيرادات والتكاليف
2. هامش الربح الإجمالي والصافي
3. تفصيل التكاليف: رسوم Amazon، شحن، COGS، إعلانات
4. المنتجات الأكثر ربحية والأقل ربحية
5. توصيات لتحسين الهامش

البيانات:\n${dataStr}`,

    INVENTORY_FORECAST: `حلّل بيانات المخزون وأنتج تقرير توقع بالعربية:
1. حالة المخزون الحالية لكل SKU
2. معدل الدوران وأيام التغطية
3. المنتجات التي تحتاج طلبًا عاجلًا (أقل من 30 يوم)
4. توصيات كميات الطلب بناءً على المعدل اليومي
5. تحذيرات المنتجات الزائدة في المخزون

البيانات:\n${dataStr}`,

    ADS_ANALYSIS: `حلّل أداء حملات الإعلانات وأنتج تقريرًا بالعربية:
1. ملخص الإنفاق والعائد (ROAS/ACoS)
2. أداء كل حملة وأدوات الاستهداف
3. الكلمات المفتاحية الأعلى أداءً والأقل
4. فرص تحسين الميزانية
5. توصيات لتحسين الإعلانات

البيانات:\n${dataStr}`,
  };

  return prompts[reportType] ?? `حلّل البيانات التالية وأعطِ تقريرًا شاملًا:\n${dataStr}`;
}

export const GET = withAuth(
  async ({ auth, req }: RouteContext) => {
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("id");

    if (reportId) {
      const report = await prisma.report.findFirst({
        where: { id: reportId, tenantId: auth.tenantId, moduleKey: ModuleKey.AMAZON_AI },
      });
      if (!report) return apiError("التقرير غير موجود", 404);
      return apiSuccess(report);
    }

    const reports = await prisma.report.findMany({
      where: { tenantId: auth.tenantId, moduleKey: ModuleKey.AMAZON_AI },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return apiSuccess(reports);
  },
  { module: ModuleKey.AMAZON_AI, permission: PERMISSIONS.AMAZON_REPORT_VIEW }
);
