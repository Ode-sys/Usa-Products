import { PrismaClient, MembershipRole, MembershipStatus, TenantType, TenantStatus, UserStatus, ModuleKey, PlanStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Odé AI Platform...");

  // ── Platform Tenant ─────────────────────────────────────────
  const platformTenant = await prisma.tenant.upsert({
    where: { slug: "ode-platform" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Odé AI Platform",
      slug: "ode-platform",
      type: TenantType.PLATFORM,
      status: TenantStatus.ACTIVE,
    },
  });

  // ── Super Admin User ─────────────────────────────────────────
  const adminEmail = process.env.SUPER_ADMIN_EMAIL ?? "admin@ode-platform.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe!2024";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      fullName: "Super Admin",
      passwordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      locale: "ar",
    },
  });

  // ── Super Admin Role ─────────────────────────────────────────
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      displayName: "Super Admin",
      displayNameAr: "مدير النظام الأعلى",
      description: "Full platform access",
      systemRole: true,
    },
  });

  // ── Membership ───────────────────────────────────────────────
  await prisma.membership.upsert({
    where: {
      userId_tenantId_agencyId_clientId: {
        userId: superAdmin.id,
        tenantId: platformTenant.id,
        agencyId: null,
        clientId: null,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      tenantId: platformTenant.id,
      role: MembershipRole.SUPER_ADMIN,
      roleId: superAdminRole.id,
      status: MembershipStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });

  // ── Modules ──────────────────────────────────────────────────
  const moduleData = [
    { key: ModuleKey.CONTENT_AI,   name: "Content AI",   nameAr: "الذكاء الاصطناعي للمحتوى",    basePrice: 19, icon: "pencil",    sortOrder: 1 },
    { key: ModuleKey.AMAZON_AI,    name: "Amazon AI",    nameAr: "الذكاء الاصطناعي لأمازون",    basePrice: 99, icon: "package",   sortOrder: 2 },
    { key: ModuleKey.BUSINESS_AI,  name: "Business AI",  nameAr: "الذكاء الاصطناعي للأعمال",    basePrice: 29, icon: "briefcase", sortOrder: 3 },
    { key: ModuleKey.SCHOOL_AI,    name: "School AI",    nameAr: "الذكاء الاصطناعي للمدارس",    basePrice: 29, icon: "school",    sortOrder: 4 },
    { key: ModuleKey.REPORTING_AI, name: "Reporting AI", nameAr: "الذكاء الاصطناعي للتقارير",   basePrice: 49, icon: "chart-bar", sortOrder: 5 },
  ];

  for (const mod of moduleData) {
    await prisma.module.upsert({
      where: { key: mod.key },
      update: {},
      create: mod,
    });
  }

  // ── Plans ────────────────────────────────────────────────────
  const plans = [
    {
      name: "individual_monthly",
      displayName: "Individual",
      displayNameAr: "فردي",
      billingInterval: "MONTHLY" as const,
      price: 29,
      features: ["1 مستخدم", "وحدة واحدة", "تقارير أساسية", "دعم بالبريد"],
      limits: { users: 1, modules: 1, ai_requests_month: 100, storage_gb: 1 },
      sortOrder: 1,
    },
    {
      name: "business_monthly",
      displayName: "Business",
      displayNameAr: "أعمال",
      billingInterval: "MONTHLY" as const,
      price: 99,
      features: ["5 مستخدمين", "3 وحدات", "تقارير متقدمة", "دعم أولوي", "API"],
      limits: { users: 5, modules: 3, ai_requests_month: 1000, storage_gb: 10 },
      sortOrder: 2,
      isPopular: true,
    },
    {
      name: "agency_monthly",
      displayName: "Agency",
      displayNameAr: "وكالة",
      billingInterval: "MONTHLY" as const,
      price: 299,
      features: ["مستخدمون غير محدودون", "جميع الوحدات", "20 عميل", "دعم مخصص"],
      limits: { users: -1, clients: 20, modules: -1, ai_requests_month: 10000, storage_gb: 100 },
      sortOrder: 3,
    },
    {
      name: "enterprise_monthly",
      displayName: "Enterprise",
      displayNameAr: "مؤسسي",
      billingInterval: "MONTHLY" as const,
      price: 999,
      features: ["كل شيء غير محدود", "SLA مخصص", "تدريب", "تكاملات مخصصة"],
      limits: { users: -1, clients: -1, modules: -1, ai_requests_month: -1, storage_gb: -1 },
      sortOrder: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: {
        ...plan,
        currency: "USD",
        status: PlanStatus.ACTIVE,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   Super Admin: ${adminEmail}`);
  console.log(`   Platform Tenant: ${platformTenant.slug}`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
