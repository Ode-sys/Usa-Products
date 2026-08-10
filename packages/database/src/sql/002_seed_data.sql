-- ============================================================
-- Odé AI Platform — Seed Data
-- Run after 001_initial_schema.sql
-- ============================================================

-- ─── MODULES ─────────────────────────────────────────────────

INSERT INTO modules (key, name, name_ar, description, base_price, icon, sort_order) VALUES
  ('CONTENT_AI',   'Content AI',   'الذكاء الاصطناعي للمحتوى',    'توليد وجدولة المحتوى', 19,  '✍️', 1),
  ('AMAZON_AI',    'Amazon AI',    'الذكاء الاصطناعي لأمازون',    'تحليل بائعي أمازون',   99,  '📦', 2),
  ('BUSINESS_AI',  'Business AI',  'الذكاء الاصطناعي للأعمال',    'CRM ومتابعة الأعمال',  29,  '💼', 3),
  ('SCHOOL_AI',    'School AI',    'الذكاء الاصطناعي للمدارس',    'إدارة المؤسسات التعليمية', 29, '🏫', 4),
  ('REPORTING_AI', 'Reporting AI', 'الذكاء الاصطناعي للتقارير',   'تحليل البيانات والتقارير', 49, '📊', 5)
ON CONFLICT (key) DO NOTHING;

-- ─── SYSTEM ROLES ─────────────────────────────────────────────

INSERT INTO roles (name, display_name, display_name_ar, description, system_role) VALUES
  ('SUPER_ADMIN',      'Super Admin',      'مدير النظام الأعلى',    'Full platform access',                            true),
  ('PLATFORM_ADMIN',   'Platform Admin',   'مدير المنصة',           'Internal platform management',                    true),
  ('AGENCY_OWNER',     'Agency Owner',     'صاحب الوكالة',          'Owns agency account, manages clients and staff',  true),
  ('AGENCY_ADMIN',     'Agency Admin',     'مدير الوكالة',          'Manages clients and staff within agency',         true),
  ('AGENCY_STAFF',     'Agency Staff',     'موظف الوكالة',          'Works on assigned clients',                       true),
  ('CLIENT_ADMIN',     'Client Admin',     'مدير العميل',           'Manages own company users and data',              true),
  ('CLIENT_USER',      'Client User',      'مستخدم العميل',         'Uses allowed modules',                            true),
  ('VIEWER',           'Viewer',           'مشاهد',                 'Read-only access',                                true),
  ('BILLING_MANAGER',  'Billing Manager',  'مدير الفواتير',         'Manages subscriptions and invoices only',         true),
  ('SUPPORT_AGENT',    'Support Agent',    'وكيل الدعم',            'Limited support access',                          true)
ON CONFLICT (name) DO NOTHING;

-- ─── PERMISSIONS ──────────────────────────────────────────────

INSERT INTO permissions (key, display_name, description, module) VALUES
  -- Platform-wide
  ('platform.manage',           'Manage Platform',       'Full platform management',            NULL),
  ('platform.users.manage',     'Manage All Users',      'Create/edit/delete any user',         NULL),
  ('platform.tenants.manage',   'Manage Tenants',        'Create/suspend/delete tenants',       NULL),
  ('platform.billing.view',     'View All Billing',      'See all revenue and invoices',        NULL),
  ('platform.audit.view',       'View Audit Logs',       'Access system audit logs',            NULL),
  ('platform.modules.manage',   'Manage Modules',        'Enable/disable platform modules',     NULL),
  -- Agency
  ('agency.manage',             'Manage Agency',         'Full agency management',              NULL),
  ('agency.clients.manage',     'Manage Clients',        'Add/edit/remove clients',             NULL),
  ('agency.staff.manage',       'Manage Staff',          'Add/edit/remove agency staff',        NULL),
  ('agency.billing.manage',     'Manage Agency Billing', 'Handle agency subscriptions',         NULL),
  ('agency.reports.view',       'View Agency Reports',   'View all client reports',             NULL),
  -- Users
  ('users.invite',              'Invite Users',          'Send user invitations',               NULL),
  ('users.manage',              'Manage Users',          'Manage users in scope',               NULL),
  ('settings.manage',           'Manage Settings',       'Update account settings',             NULL),
  ('billing.manage',            'Manage Billing',        'Handle own billing',                  NULL),
  -- Content AI
  ('content.project.create',    'Create Projects',       'Create content projects',             'CONTENT_AI'),
  ('content.project.manage',    'Manage Projects',       'Edit/delete content projects',        'CONTENT_AI'),
  ('content.create',            'Create Content',        'Create content items',                'CONTENT_AI'),
  ('content.approve',           'Approve Content',       'Approve content for publishing',      'CONTENT_AI'),
  ('content.publish',           'Publish Content',       'Publish or schedule content',         'CONTENT_AI'),
  ('content.calendar.view',     'View Calendar',         'View content calendar',               'CONTENT_AI'),
  -- Amazon AI
  ('amazon.account.manage',     'Manage Amazon Accounts','Add/edit Amazon seller accounts',    'AMAZON_AI'),
  ('amazon.upload',             'Upload Files',          'Upload Amazon report files',          'AMAZON_AI'),
  ('amazon.report.view',        'View Reports',          'View Amazon AI reports',              'AMAZON_AI'),
  ('amazon.report.generate',    'Generate Reports',      'Generate WBR/ASIN/P&L reports',       'AMAZON_AI'),
  ('amazon.metrics.view',       'View Metrics',          'View Amazon performance metrics',     'AMAZON_AI'),
  -- Business AI
  ('business.crm.manage',       'Manage CRM',            'Manage contacts and deals',           'BUSINESS_AI'),
  ('business.tasks.manage',     'Manage Tasks',          'Create and manage tasks',             'BUSINESS_AI'),
  ('business.reports.view',     'View Business Reports', 'View business analytics',             'BUSINESS_AI'),
  -- School AI
  ('school.students.manage',    'Manage Students',       'Add/edit/remove students',            'SCHOOL_AI'),
  ('school.attendance.manage',  'Manage Attendance',     'Record student attendance',           'SCHOOL_AI'),
  ('school.payments.manage',    'Manage Payments',       'Handle school payments',              'SCHOOL_AI'),
  ('school.reports.view',       'View School Reports',   'View school analytics',               'SCHOOL_AI'),
  -- Reporting AI
  ('reporting.files.upload',    'Upload Files',          'Upload data files for analysis',      'REPORTING_AI'),
  ('reporting.datasets.manage', 'Manage Datasets',       'Manage parsed datasets',              'REPORTING_AI'),
  ('reporting.dashboard.create','Create Dashboards',     'Build reporting dashboards',          'REPORTING_AI'),
  ('reporting.dashboard.view',  'View Dashboards',       'View reporting dashboards',           'REPORTING_AI'),
  ('reporting.insights.view',   'View AI Insights',      'Access AI-generated insights',        'REPORTING_AI'),
  ('reporting.export',          'Export Reports',        'Export PDF/Excel/Docx reports',       'REPORTING_AI')
ON CONFLICT (key) DO NOTHING;

-- ─── ROLE-PERMISSION MAPPING ──────────────────────────────────

-- SUPER_ADMIN gets ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- AGENCY_OWNER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'AGENCY_OWNER'
  AND p.key IN (
    'agency.manage','agency.clients.manage','agency.staff.manage',
    'agency.billing.manage','agency.reports.view',
    'users.invite','users.manage','settings.manage','billing.manage',
    'content.project.create','content.project.manage','content.create',
    'content.approve','content.publish','content.calendar.view',
    'amazon.account.manage','amazon.upload','amazon.report.view',
    'amazon.report.generate','amazon.metrics.view',
    'business.crm.manage','business.tasks.manage','business.reports.view',
    'school.students.manage','school.attendance.manage',
    'school.payments.manage','school.reports.view',
    'reporting.files.upload','reporting.datasets.manage',
    'reporting.dashboard.create','reporting.dashboard.view',
    'reporting.insights.view','reporting.export'
  )
ON CONFLICT DO NOTHING;

-- CLIENT_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'CLIENT_ADMIN'
  AND p.key IN (
    'users.invite','users.manage','settings.manage','billing.manage',
    'content.project.create','content.create','content.approve',
    'content.publish','content.calendar.view',
    'amazon.upload','amazon.report.view','amazon.report.generate','amazon.metrics.view',
    'business.crm.manage','business.tasks.manage','business.reports.view',
    'school.students.manage','school.attendance.manage',
    'school.payments.manage','school.reports.view',
    'reporting.files.upload','reporting.datasets.manage',
    'reporting.dashboard.create','reporting.dashboard.view',
    'reporting.insights.view','reporting.export'
  )
ON CONFLICT DO NOTHING;

-- CLIENT_USER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'CLIENT_USER'
  AND p.key IN (
    'content.create','content.calendar.view',
    'amazon.upload','amazon.report.view','amazon.metrics.view',
    'business.crm.manage','business.tasks.manage',
    'school.attendance.manage',
    'reporting.files.upload','reporting.dashboard.view',
    'reporting.insights.view'
  )
ON CONFLICT DO NOTHING;

-- VIEWER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'VIEWER'
  AND p.key IN (
    'content.calendar.view',
    'amazon.report.view','amazon.metrics.view',
    'business.reports.view','school.reports.view',
    'reporting.dashboard.view','reporting.insights.view'
  )
ON CONFLICT DO NOTHING;

-- BILLING_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'BILLING_MANAGER'
  AND p.key IN ('billing.manage','agency.billing.manage','platform.billing.view')
ON CONFLICT DO NOTHING;

-- ─── PLANS ───────────────────────────────────────────────────

INSERT INTO plans (name, display_name, display_name_ar, description, billing_interval, price, currency, features, limits, sort_order, is_popular) VALUES
  ('individual_monthly', 'Individual', 'فردي',
   'For solo operators', 'MONTHLY', 29, 'USD',
   '["1 user","1 module","Basic reports","Email support"]',
   '{"users":1,"modules":1,"ai_requests_month":100,"file_uploads_month":10,"storage_gb":1}',
   1, false),

  ('business_monthly', 'Business', 'أعمال',
   'For small teams', 'MONTHLY', 99, 'USD',
   '["5 users","3 modules","Advanced reports","Priority support","API access"]',
   '{"users":5,"modules":3,"ai_requests_month":1000,"file_uploads_month":100,"storage_gb":10}',
   2, true),

  ('agency_monthly', 'Agency', 'وكالة',
   'For agencies with multiple clients', 'MONTHLY', 299, 'USD',
   '["Unlimited users","All modules","Unlimited reports","Dedicated support","White-label ready","Client portals"]',
   '{"users":-1,"clients":20,"modules":-1,"ai_requests_month":10000,"file_uploads_month":1000,"storage_gb":100}',
   3, false),

  ('enterprise_monthly', 'Enterprise', 'مؤسسي',
   'Custom pricing for large organisations', 'MONTHLY', 999, 'USD',
   '["Unlimited everything","Custom SLA","Dedicated infrastructure","Custom integrations","Training"]',
   '{"users":-1,"clients":-1,"modules":-1,"ai_requests_month":-1,"file_uploads_month":-1,"storage_gb":-1}',
   4, false),

  -- Yearly (20% discount)
  ('individual_yearly', 'Individual (Yearly)', 'فردي (سنوي)',
   'For solo operators — save 20%', 'YEARLY', 278, 'USD',
   '["1 user","1 module","Basic reports","Email support"]',
   '{"users":1,"modules":1,"ai_requests_month":100,"file_uploads_month":10,"storage_gb":1}',
   5, false),

  ('business_yearly', 'Business (Yearly)', 'أعمال (سنوي)',
   'For small teams — save 20%', 'YEARLY', 950, 'USD',
   '["5 users","3 modules","Advanced reports","Priority support","API access"]',
   '{"users":5,"modules":3,"ai_requests_month":1000,"file_uploads_month":100,"storage_gb":10}',
   6, false),

  ('agency_yearly', 'Agency (Yearly)', 'وكالة (سنوي)',
   'For agencies — save 20%', 'YEARLY', 2870, 'USD',
   '["Unlimited users","All modules","Unlimited reports","Dedicated support","White-label ready"]',
   '{"users":-1,"clients":20,"modules":-1,"ai_requests_month":10000,"file_uploads_month":1000,"storage_gb":100}',
   7, false)
ON CONFLICT DO NOTHING;

-- ─── PLATFORM TENANT ──────────────────────────────────────────

INSERT INTO tenants (id, name, slug, type, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Odé AI Platform', 'ode-platform', 'PLATFORM', 'ACTIVE')
ON CONFLICT (slug) DO NOTHING;
