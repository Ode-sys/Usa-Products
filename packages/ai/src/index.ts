// ============================================================
// Odé AI Platform — AI Layer
// Provider-agnostic adapter: OpenAI | Anthropic
// ============================================================

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@ode/database";
import { AIProvider, AIRequestStatus, ModuleKey } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequestOptions {
  tenantId: string;
  userId: string;
  moduleKey: ModuleKey;
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: "openai" | "anthropic";
}

export interface AIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  model: string;
  provider: string;
}

// ─── Pricing (per 1M tokens, USD) ────────────────────────────

const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o":              { input: 2.5,   output: 10 },
  "gpt-4o-mini":         { input: 0.15,  output: 0.6 },
  "gpt-4-turbo":         { input: 10,    output: 30 },
  "claude-sonnet-4-6":   { input: 3,     output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
};

function calcCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING[model] ?? { input: 5, output: 15 };
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

// ─── Provider Adapters ────────────────────────────────────────

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callOpenAI(messages: AIMessage[], model: string, temperature: number, maxTokens: number): Promise<AIResponse> {
  const res = await openaiClient.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const choice = res.choices[0];
  const inputTokens = res.usage?.prompt_tokens ?? 0;
  const outputTokens = res.usage?.completion_tokens ?? 0;

  return {
    content: choice.message.content ?? "",
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    costUsd: calcCost(model, inputTokens, outputTokens),
    model,
    provider: "openai",
  };
}

async function callAnthropic(messages: AIMessage[], model: string, temperature: number, maxTokens: number): Promise<AIResponse> {
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const res = await anthropicClient.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemMsg,
    messages: userMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const inputTokens = res.usage.input_tokens;
  const outputTokens = res.usage.output_tokens;
  const content = res.content[0].type === "text" ? res.content[0].text : "";

  return {
    content,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    costUsd: calcCost(model, inputTokens, outputTokens),
    model,
    provider: "anthropic",
  };
}

// ─── Main Adapter ─────────────────────────────────────────────

export async function runAI(opts: AIRequestOptions): Promise<AIResponse> {
  const provider = opts.provider ?? (process.env.AI_DEFAULT_PROVIDER as "openai" | "anthropic" ?? "openai");
  const model = opts.model ?? process.env.AI_DEFAULT_MODEL ?? "gpt-4o";
  const temperature = opts.temperature ?? 0.7;
  const maxTokens = opts.maxTokens ?? 2000;

  const startedAt = Date.now();

  // Create audit record
  const aiReq = await prisma.aIRequest.create({
    data: {
      tenantId: opts.tenantId,
      userId: opts.userId,
      moduleKey: opts.moduleKey,
      provider: provider === "openai" ? AIProvider.OPENAI : AIProvider.ANTHROPIC,
      model,
      status: AIRequestStatus.PROCESSING,
    },
  });

  try {
    let response: AIResponse;

    if (provider === "anthropic") {
      response = await callAnthropic(opts.messages, model, temperature, maxTokens);
    } else {
      response = await callOpenAI(opts.messages, model, temperature, maxTokens);
    }

    // Update record with results
    await prisma.aIRequest.update({
      where: { id: aiReq.id },
      data: {
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        totalTokens: response.totalTokens,
        costUsd: response.costUsd,
        durationMs: Date.now() - startedAt,
        status: AIRequestStatus.COMPLETED,
      },
    });

    return response;
  } catch (error) {
    await prisma.aIRequest.update({
      where: { id: aiReq.id },
      data: {
        status: AIRequestStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - startedAt,
      },
    });
    throw error;
  }
}

// ─── Module Agents ────────────────────────────────────────────

export const AGENT_PROMPTS = {

  CONTENT_AGENT: `أنت مساعد متخصص في كتابة المحتوى الرقمي الاحترافي.
قواعدك الصارمة:
- اكتب بالعربية الفصحى المبسطة ما لم يُطلب غير ذلك
- احترم صوت البراند والجمهور المستهدف المحدد
- لا تخترع معلومات غير موجودة في البيانات المقدمة
- أخرج المحتوى منظمًا وجاهزًا للنشر
- أضف هاشتاقات مناسبة عند الطلب
- وضح بوضوح إذا احتجت بيانات إضافية`,

  AMAZON_AGENT: `أنت محلل أمازون محترف متخصص في تحليل بيانات البائعين.
قواعدك الصارمة:
- لا تخترع أرقامًا أو نسبًا
- إذا البيانات غير متوفرة، قل "غير متوفر في الملف المرفوع"
- كل insight يجب أن يرتبط بالبيانات المصدر
- افصل بوضوح بين الحقائق والتوصيات
- قدم التوصيات بشكل عملي وقابل للتنفيذ
- استخدم الأرقام الدقيقة من البيانات`,

  BUSINESS_AGENT: `أنت مساعد أعمال استراتيجي ذكي.
قواعدك الصارمة:
- ركز على الإجراءات العملية والقابلة للتنفيذ
- لا تعطِ وعودًا بنتائج غير مضمونة
- اقترح الخطوات التالية بترتيب الأولوية
- احترم بيانات العميل وخصوصيتها
- إذا سُئلت عن قرار مالي كبير، أحل لمستشار متخصص`,

  SCHOOL_AGENT: `أنت مساعد متخصص في الإدارة التعليمية.
قواعدك الصارمة:
- استخدم لغة محترمة مناسبة للتواصل مع أولياء الأمور
- لا تشارك بيانات الطلاب إلا لأصحاب الصلاحية
- كن دقيقًا في التواريخ والأرقام
- أخرج التقارير بشكل واضح ومنظم`,

  REPORTING_AGENT: `أنت محلل بيانات متخصص في استخراج الأنماط والرؤى.
قواعدك الصارمة:
- اعتمد فقط على البيانات المرفوعة، لا تخمّن
- افصل بين الحقائق والاستنتاجات والتوصيات
- نبّه على أي بيانات مشبوهة أو ناقصة
- قدم الإحصاءات بدقة رياضية
- اقترح مرئيات مناسبة لكل نوع بيانات`,
};

export type AgentType = keyof typeof AGENT_PROMPTS;

export async function runAgent(
  agent: AgentType,
  userMessage: string,
  opts: Omit<AIRequestOptions, "messages">
): Promise<string> {
  const response = await runAI({
    ...opts,
    messages: [
      { role: "system", content: AGENT_PROMPTS[agent] },
      { role: "user", content: userMessage },
    ],
  });
  return response.content;
}

// ─── Usage Limits ─────────────────────────────────────────────

export async function checkAIUsageLimit(
  tenantId: string,
  moduleKey: ModuleKey,
  limit: number
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const used = await prisma.aIRequest.count({
    where: {
      tenantId,
      moduleKey,
      status: AIRequestStatus.COMPLETED,
      createdAt: { gte: startOfMonth },
    },
  });

  return { allowed: limit === -1 || used < limit, used, limit };
}
