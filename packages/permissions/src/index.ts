// ============================================================
// Odé AI Platform — Permission System (RBAC + ABAC)
// ============================================================

import { MembershipRole, ModuleKey } from "@prisma/client";

// ─── Permission Keys ─────────────────────────────────────────

export const PERMISSIONS = {
  // Platform
  PLATFORM_MANAGE:          "platform.manage",
  PLATFORM_USERS_MANAGE:    "platform.users.manage",
  PLATFORM_TENANTS_MANAGE:  "platform.tenants.manage",
  PLATFORM_BILLING_VIEW:    "platform.billing.view",
  PLATFORM_AUDIT_VIEW:      "platform.audit.view",
  PLATFORM_MODULES_MANAGE:  "platform.modules.manage",
  // Agency
  AGENCY_MANAGE:            "agency.manage",
  AGENCY_CLIENTS_MANAGE:    "agency.clients.manage",
  AGENCY_STAFF_MANAGE:      "agency.staff.manage",
  AGENCY_BILLING_MANAGE:    "agency.billing.manage",
  AGENCY_REPORTS_VIEW:      "agency.reports.view",
  // Users
  USERS_INVITE:             "users.invite",
  USERS_MANAGE:             "users.manage",
  SETTINGS_MANAGE:          "settings.manage",
  BILLING_MANAGE:           "billing.manage",
  // Content AI
  CONTENT_PROJECT_CREATE:   "content.project.create",
  CONTENT_PROJECT_MANAGE:   "content.project.manage",
  CONTENT_CREATE:           "content.create",
  CONTENT_APPROVE:          "content.approve",
  CONTENT_PUBLISH:          "content.publish",
  CONTENT_CALENDAR_VIEW:    "content.calendar.view",
  // Amazon AI
  AMAZON_ACCOUNT_MANAGE:    "amazon.account.manage",
  AMAZON_UPLOAD:            "amazon.upload",
  AMAZON_REPORT_VIEW:       "amazon.report.view",
  AMAZON_REPORT_GENERATE:   "amazon.report.generate",
  AMAZON_METRICS_VIEW:      "amazon.metrics.view",
  // Business AI
  BUSINESS_CRM_MANAGE:      "business.crm.manage",
  BUSINESS_TASKS_MANAGE:    "business.tasks.manage",
  BUSINESS_REPORTS_VIEW:    "business.reports.view",
  // School AI
  SCHOOL_STUDENTS_MANAGE:   "school.students.manage",
  SCHOOL_ATTENDANCE_MANAGE: "school.attendance.manage",
  SCHOOL_PAYMENTS_MANAGE:   "school.payments.manage",
  SCHOOL_REPORTS_VIEW:      "school.reports.view",
  // Reporting AI
  REPORTING_FILES_UPLOAD:   "reporting.files.upload",
  REPORTING_DATASETS_MANAGE:"reporting.datasets.manage",
  REPORTING_DASHBOARD_CREATE:"reporting.dashboard.create",
  REPORTING_DASHBOARD_VIEW: "reporting.dashboard.view",
  REPORTING_INSIGHTS_VIEW:  "reporting.insights.view",
  REPORTING_EXPORT:         "reporting.export",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ─── Role Permission Matrix ───────────────────────────────────

const ROLE_PERMISSIONS: Record<MembershipRole, PermissionKey[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS) as PermissionKey[],

  PLATFORM_ADMIN: [
    PERMISSIONS.PLATFORM_USERS_MANAGE,
    PERMISSIONS.PLATFORM_TENANTS_MANAGE,
    PERMISSIONS.PLATFORM_BILLING_VIEW,
    PERMISSIONS.PLATFORM_AUDIT_VIEW,
    PERMISSIONS.PLATFORM_MODULES_MANAGE,
  ],

  AGENCY_OWNER: [
    PERMISSIONS.AGENCY_MANAGE, PERMISSIONS.AGENCY_CLIENTS_MANAGE,
    PERMISSIONS.AGENCY_STAFF_MANAGE, PERMISSIONS.AGENCY_BILLING_MANAGE,
    PERMISSIONS.AGENCY_REPORTS_VIEW,
    PERMISSIONS.USERS_INVITE, PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE, PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.CONTENT_PROJECT_CREATE, PERMISSIONS.CONTENT_PROJECT_MANAGE,
    PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_APPROVE,
    PERMISSIONS.CONTENT_PUBLISH, PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_ACCOUNT_MANAGE, PERMISSIONS.AMAZON_UPLOAD,
    PERMISSIONS.AMAZON_REPORT_VIEW, PERMISSIONS.AMAZON_REPORT_GENERATE,
    PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_CRM_MANAGE, PERMISSIONS.BUSINESS_TASKS_MANAGE,
    PERMISSIONS.BUSINESS_REPORTS_VIEW,
    PERMISSIONS.SCHOOL_STUDENTS_MANAGE, PERMISSIONS.SCHOOL_ATTENDANCE_MANAGE,
    PERMISSIONS.SCHOOL_PAYMENTS_MANAGE, PERMISSIONS.SCHOOL_REPORTS_VIEW,
    PERMISSIONS.REPORTING_FILES_UPLOAD, PERMISSIONS.REPORTING_DATASETS_MANAGE,
    PERMISSIONS.REPORTING_DASHBOARD_CREATE, PERMISSIONS.REPORTING_DASHBOARD_VIEW,
    PERMISSIONS.REPORTING_INSIGHTS_VIEW, PERMISSIONS.REPORTING_EXPORT,
  ],

  AGENCY_ADMIN: [
    PERMISSIONS.AGENCY_CLIENTS_MANAGE, PERMISSIONS.AGENCY_REPORTS_VIEW,
    PERMISSIONS.USERS_INVITE, PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.CONTENT_PROJECT_CREATE, PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_APPROVE, PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_UPLOAD, PERMISSIONS.AMAZON_REPORT_VIEW,
    PERMISSIONS.AMAZON_REPORT_GENERATE, PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_CRM_MANAGE, PERMISSIONS.BUSINESS_TASKS_MANAGE,
    PERMISSIONS.REPORTING_FILES_UPLOAD, PERMISSIONS.REPORTING_DATASETS_MANAGE,
    PERMISSIONS.REPORTING_DASHBOARD_VIEW, PERMISSIONS.REPORTING_INSIGHTS_VIEW,
    PERMISSIONS.REPORTING_EXPORT,
  ],

  AGENCY_STAFF: [
    PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_UPLOAD, PERMISSIONS.AMAZON_REPORT_VIEW,
    PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_TASKS_MANAGE,
    PERMISSIONS.REPORTING_FILES_UPLOAD, PERMISSIONS.REPORTING_DASHBOARD_VIEW,
    PERMISSIONS.REPORTING_INSIGHTS_VIEW,
  ],

  CLIENT_ADMIN: [
    PERMISSIONS.USERS_INVITE, PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE, PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.CONTENT_PROJECT_CREATE, PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_APPROVE, PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_UPLOAD, PERMISSIONS.AMAZON_REPORT_VIEW,
    PERMISSIONS.AMAZON_REPORT_GENERATE, PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_CRM_MANAGE, PERMISSIONS.BUSINESS_TASKS_MANAGE,
    PERMISSIONS.BUSINESS_REPORTS_VIEW,
    PERMISSIONS.SCHOOL_STUDENTS_MANAGE, PERMISSIONS.SCHOOL_ATTENDANCE_MANAGE,
    PERMISSIONS.SCHOOL_PAYMENTS_MANAGE, PERMISSIONS.SCHOOL_REPORTS_VIEW,
    PERMISSIONS.REPORTING_FILES_UPLOAD, PERMISSIONS.REPORTING_DATASETS_MANAGE,
    PERMISSIONS.REPORTING_DASHBOARD_CREATE, PERMISSIONS.REPORTING_DASHBOARD_VIEW,
    PERMISSIONS.REPORTING_INSIGHTS_VIEW, PERMISSIONS.REPORTING_EXPORT,
  ],

  CLIENT_USER: [
    PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_UPLOAD, PERMISSIONS.AMAZON_REPORT_VIEW,
    PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_CRM_MANAGE, PERMISSIONS.BUSINESS_TASKS_MANAGE,
    PERMISSIONS.SCHOOL_ATTENDANCE_MANAGE,
    PERMISSIONS.REPORTING_FILES_UPLOAD, PERMISSIONS.REPORTING_DASHBOARD_VIEW,
    PERMISSIONS.REPORTING_INSIGHTS_VIEW,
  ],

  VIEWER: [
    PERMISSIONS.CONTENT_CALENDAR_VIEW,
    PERMISSIONS.AMAZON_REPORT_VIEW, PERMISSIONS.AMAZON_METRICS_VIEW,
    PERMISSIONS.BUSINESS_REPORTS_VIEW, PERMISSIONS.SCHOOL_REPORTS_VIEW,
    PERMISSIONS.REPORTING_DASHBOARD_VIEW, PERMISSIONS.REPORTING_INSIGHTS_VIEW,
  ],

  BILLING_MANAGER: [
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.AGENCY_BILLING_MANAGE,
    PERMISSIONS.PLATFORM_BILLING_VIEW,
  ],

  SUPPORT_AGENT: [
    PERMISSIONS.PLATFORM_AUDIT_VIEW,
  ],
};

// ─── Context Types ────────────────────────────────────────────

export interface AuthContext {
  userId: string;
  tenantId: string;
  role: MembershipRole;
  agencyId?: string | null;
  clientId?: string | null;
  customPermissions?: Record<string, boolean>;
  moduleAccess?: ModuleKey[];
}

// ─── Core Functions ───────────────────────────────────────────

export function hasPermission(ctx: AuthContext, permission: PermissionKey): boolean {
  // Custom overrides first
  if (ctx.customPermissions) {
    if (ctx.customPermissions[permission] === false) return false;
    if (ctx.customPermissions[permission] === true) return true;
  }

  const rolePerms = ROLE_PERMISSIONS[ctx.role] ?? [];
  return rolePerms.includes(permission);
}

export function hasAllPermissions(ctx: AuthContext, permissions: PermissionKey[]): boolean {
  return permissions.every((p) => hasPermission(ctx, p));
}

export function hasAnyPermission(ctx: AuthContext, permissions: PermissionKey[]): boolean {
  return permissions.some((p) => hasPermission(ctx, p));
}

export function hasModuleAccess(ctx: AuthContext, moduleKey: ModuleKey): boolean {
  if (ctx.role === MembershipRole.SUPER_ADMIN) return true;
  return ctx.moduleAccess?.includes(moduleKey) ?? false;
}

export function isSuperAdmin(ctx: AuthContext): boolean {
  return ctx.role === MembershipRole.SUPER_ADMIN;
}

export function isPlatformAdmin(ctx: AuthContext): boolean {
  return ctx.role === MembershipRole.SUPER_ADMIN ||
    ctx.role === MembershipRole.PLATFORM_ADMIN;
}

export function isAgencyLevel(ctx: AuthContext): boolean {
  return [
    MembershipRole.AGENCY_OWNER,
    MembershipRole.AGENCY_ADMIN,
    MembershipRole.AGENCY_STAFF,
  ].includes(ctx.role);
}

export function canAccessTenant(ctx: AuthContext, tenantId: string): boolean {
  if (isSuperAdmin(ctx)) return true;
  return ctx.tenantId === tenantId;
}

export function canAccessClient(ctx: AuthContext, clientId: string): boolean {
  if (isSuperAdmin(ctx)) return true;
  if (isPlatformAdmin(ctx)) return true;
  // Agency owner/admin can access all their clients
  if ([MembershipRole.AGENCY_OWNER, MembershipRole.AGENCY_ADMIN].includes(ctx.role)) return true;
  // Staff and client roles: only their assigned client
  return ctx.clientId === clientId;
}

export function getRolePermissions(role: MembershipRole): PermissionKey[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Module-to-Permission Map ─────────────────────────────────

export const MODULE_REQUIRED_PERMISSIONS: Record<ModuleKey, PermissionKey[]> = {
  CONTENT_AI:   [PERMISSIONS.CONTENT_CALENDAR_VIEW],
  AMAZON_AI:    [PERMISSIONS.AMAZON_REPORT_VIEW],
  BUSINESS_AI:  [PERMISSIONS.BUSINESS_REPORTS_VIEW],
  SCHOOL_AI:    [PERMISSIONS.SCHOOL_REPORTS_VIEW],
  REPORTING_AI: [PERMISSIONS.REPORTING_DASHBOARD_VIEW],
};
