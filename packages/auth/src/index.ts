// ============================================================
// Odé AI Platform — Auth Package
// JWT-based auth with multi-tenant context
// ============================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import type { AuthContext } from "@ode/permissions";
import type { MembershipRole, ModuleKey } from "@prisma/client";

// ─── Config ──────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is required in production");
}

// ─── Types ────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;           // userId
  tenantId: string;
  role: MembershipRole;
  agencyId?: string | null;
  clientId?: string | null;
  moduleAccess?: ModuleKey[];
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Password ─────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) return { valid: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" };
  if (!/[A-Z]/.test(password)) return { valid: false, message: "يجب أن تحتوي على حرف كبير واحد على الأقل" };
  if (!/[0-9]/.test(password)) return { valid: false, message: "يجب أن تحتوي على رقم واحد على الأقل" };
  return { valid: true };
}

// ─── JWT ──────────────────────────────────────────────────────

export function signAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET || "dev-secret-change-in-production", {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "refresh" }, JWT_SECRET || "dev-secret-change-in-production", {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET || "dev-secret-change-in-production") as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { sub: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET || "dev-secret-change-in-production") as { sub: string; type: string };
    if (payload.type !== "refresh") return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function generateSessionToken(): string {
  return nanoid(64);
}

export function generateResetToken(): string {
  return nanoid(32);
}

// ─── Token Pair ───────────────────────────────────────────────

export function createTokenPair(payload: Omit<JWTPayload, "iat" | "exp">): TokenPair {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload.sub);

  // Parse JWT_EXPIRES_IN to seconds
  const expiresIn = parseExpiresIn(JWT_EXPIRES_IN);

  return { accessToken, refreshToken, expiresIn };
}

function parseExpiresIn(val: string): number {
  const match = val.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const num = parseInt(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return num * (multipliers[unit] ?? 60);
}

// ─── Auth Context Builder ─────────────────────────────────────

export function buildAuthContext(payload: JWTPayload): AuthContext {
  return {
    userId: payload.sub,
    tenantId: payload.tenantId,
    role: payload.role,
    agencyId: payload.agencyId,
    clientId: payload.clientId,
    moduleAccess: payload.moduleAccess ?? [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────

export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}

export { AuthContext } from "@ode/permissions";
