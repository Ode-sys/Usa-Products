import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, error: { message, code } }, { status });
}

export function apiUnauthorized(message = "غير مصرح") {
  return apiError(message, 401, "UNAUTHORIZED");
}

export function apiForbidden(message = "ليس لديك صلاحية للوصول") {
  return apiError(message, 403, "FORBIDDEN");
}

export function apiNotFound(resource = "المورد") {
  return apiError(`${resource} غير موجود`, 404, "NOT_FOUND");
}

export function apiValidationError(errors: Record<string, string[]>) {
  return NextResponse.json({ success: false, error: { message: "بيانات غير صحيحة", code: "VALIDATION_ERROR", errors } }, { status: 422 });
}

export function apiRateLimit() {
  return apiError("تم تجاوز حد الطلبات، حاول مرة أخرى لاحقًا", 429, "RATE_LIMIT");
}
