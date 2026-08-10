// ============================================================
// Odé AI Platform — Shared Utilities
// ============================================================

// ─── Constants ───────────────────────────────────────────────

export const APP_NAME = "Odé AI Platform";
export const SUPPORT_EMAIL = "support@ode-platform.com";

// ─── Module Display Names ─────────────────────────────────────

export const MODULE_NAMES: Record<string, { en: string; ar: string; color: string }> = {
  CONTENT_AI:   { en: "Content AI",   ar: "الذكاء الاصطناعي للمحتوى",  color: "#8b5cf6" },
  AMAZON_AI:    { en: "Amazon AI",    ar: "الذكاء الاصطناعي لأمازون",  color: "#f97316" },
  BUSINESS_AI:  { en: "Business AI",  ar: "الذكاء الاصطناعي للأعمال",  color: "#3b82f6" },
  SCHOOL_AI:    { en: "School AI",    ar: "الذكاء الاصطناعي للمدارس",  color: "#22c55e" },
  REPORTING_AI: { en: "Reporting AI", ar: "الذكاء الاصطناعي للتقارير", color: "#14b8a6" },
};

// ─── Role Display Names ───────────────────────────────────────

export const ROLE_NAMES: Record<string, { en: string; ar: string }> = {
  SUPER_ADMIN:     { en: "Super Admin",     ar: "مدير النظام الأعلى" },
  PLATFORM_ADMIN:  { en: "Platform Admin",  ar: "مدير المنصة" },
  AGENCY_OWNER:    { en: "Agency Owner",    ar: "صاحب الوكالة" },
  AGENCY_ADMIN:    { en: "Agency Admin",    ar: "مدير الوكالة" },
  AGENCY_STAFF:    { en: "Agency Staff",    ar: "موظف الوكالة" },
  CLIENT_ADMIN:    { en: "Client Admin",    ar: "مدير العميل" },
  CLIENT_USER:     { en: "Client User",     ar: "مستخدم العميل" },
  VIEWER:          { en: "Viewer",          ar: "مشاهد" },
  BILLING_MANAGER: { en: "Billing Manager", ar: "مدير الفواتير" },
  SUPPORT_AGENT:   { en: "Support Agent",   ar: "وكيل الدعم" },
};

// ─── API Error Codes ──────────────────────────────────────────

export const ERROR_CODES = {
  UNAUTHORIZED:      "UNAUTHORIZED",
  FORBIDDEN:         "FORBIDDEN",
  NOT_FOUND:         "NOT_FOUND",
  VALIDATION_ERROR:  "VALIDATION_ERROR",
  RATE_LIMIT:        "RATE_LIMIT",
  AI_LIMIT_EXCEEDED: "AI_LIMIT_EXCEEDED",
  MODULE_INACTIVE:   "MODULE_INACTIVE",
  TENANT_SUSPENDED:  "TENANT_SUSPENDED",
} as const;

// ─── Pagination ───────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(items: T[], total: number, params: PaginationParams): PaginatedResult<T> {
  return { items, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
}

export function getPaginationOffset(params: PaginationParams): { skip: number; take: number } {
  return { skip: (params.page - 1) * params.limit, take: params.limit };
}
