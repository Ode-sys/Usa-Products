import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";
import { db } from "@ode/database";
import { getPaginationOffset } from "@ode/shared";
import { runAgent } from "@ode/ai";
import { z } from "zod";

const generateSchema = z.object({
  topic: z.string().min(3).max(500),
  platforms: z.array(z.string()).min(1).max(5),
  tone: z.enum(["professional", "friendly", "humorous", "formal", "inspiring"]).default("professional"),
  contentType: z.enum(["post", "caption", "article", "email"]).default("post"),
  language: z.enum(["ar", "en"]).default("ar"),
});

export const GET = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const { searchParams } = new URL(authReq.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const projectId = searchParams.get("projectId") ?? undefined;

    const where = { tenantId: ctx.tenantId, ...(projectId ? { projectId } : {}) };
    const [items, total] = await Promise.all([
      db.contentItem.findMany({
        where,
        ...getPaginationOffset({ page, limit }),
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, platform: true, status: true, scheduledAt: true, publishedAt: true, createdAt: true },
      }),
      db.contentItem.count({ where }),
    ]);

    return apiSuccess({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  }, { module: "CONTENT_AI" });

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = generateSchema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const { topic, platforms, tone, contentType, language } = parse.data;

    const prompt = `اكتب محتوى ${contentType} عن الموضوع التالي: "${topic}"\n\nالأسلوب: ${tone}\nاللغة: ${language === "ar" ? "العربية" : "الإنجليزية"}\nالمنصات المطلوبة: ${platforms.join("، ")}\n\nاكتب نسخة منفصلة لكل منصة، وراعِ خصائص كل منصة (الطول، الهاشتاقات، الأسلوب).`;

    const result = await runAgent("ContentAgent", prompt, {
      tenantId: ctx.tenantId,
      userId: ctx.userId,
      model: "gpt-4o-mini",
    });

    const itemsCreated = await Promise.all(
      platforms.map((platform) =>
        db.contentItem.create({
          data: {
            tenantId: ctx.tenantId,
            projectId: null,
            title: topic.slice(0, 100),
            body: result.content,
            platform,
            status: "DRAFT",
            language,
            createdById: ctx.userId,
          },
        })
      )
    );

    return apiSuccess({ content: result.content, items: itemsCreated.map((i) => i.id) }, 201);
  }, { module: "CONTENT_AI", permission: "content.create" });
