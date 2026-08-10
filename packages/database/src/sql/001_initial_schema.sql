-- ============================================================
-- Odé AI Platform — Complete SQL Schema
-- PostgreSQL 15+  |  Run once on fresh database
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE tenant_type   AS ENUM ('PLATFORM','AGENCY','CLIENT');
  CREATE TYPE tenant_status AS ENUM ('ACTIVE','SUSPENDED','PENDING','ARCHIVED');
  CREATE TYPE user_status   AS ENUM ('ACTIVE','SUSPENDED','PENDING','DELETED');
  CREATE TYPE membership_role AS ENUM (
    'SUPER_ADMIN','PLATFORM_ADMIN',
    'AGENCY_OWNER','AGENCY_ADMIN','AGENCY_STAFF',
    'CLIENT_ADMIN','CLIENT_USER',
    'VIEWER','BILLING_MANAGER','SUPPORT_AGENT'
  );
  CREATE TYPE membership_status AS ENUM ('ACTIVE','INACTIVE','PENDING','REVOKED');
  CREATE TYPE module_key    AS ENUM ('CONTENT_AI','AMAZON_AI','BUSINESS_AI','SCHOOL_AI','REPORTING_AI');
  CREATE TYPE module_status AS ENUM ('ACTIVE','INACTIVE','MAINTENANCE');
  CREATE TYPE tenant_module_status AS ENUM ('ACTIVE','INACTIVE','TRIAL','EXPIRED');
  CREATE TYPE billing_interval    AS ENUM ('MONTHLY','YEARLY','ONE_TIME');
  CREATE TYPE plan_status         AS ENUM ('ACTIVE','INACTIVE','ARCHIVED');
  CREATE TYPE subscription_status AS ENUM ('ACTIVE','CANCELED','PAST_DUE','TRIALING','PAUSED','INCOMPLETE');
  CREATE TYPE billing_provider    AS ENUM ('STRIPE','PAYPAL','MANUAL');
  CREATE TYPE invoice_status      AS ENUM ('DRAFT','OPEN','PAID','VOID','UNCOLLECTIBLE');
  CREATE TYPE file_status         AS ENUM ('PENDING','PROCESSING','READY','FAILED','DELETED');
  CREATE TYPE ai_provider         AS ENUM ('OPENAI','ANTHROPIC','GOOGLE','MISTRAL');
  CREATE TYPE ai_request_status   AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','RATE_LIMITED');
  CREATE TYPE report_status       AS ENUM ('PENDING','GENERATING','READY','FAILED');
  CREATE TYPE content_item_type   AS ENUM ('POST','SCRIPT','REEL','EMAIL','BLOG','AD_COPY','STORY');
  CREATE TYPE content_item_status AS ENUM ('DRAFT','REVIEW','APPROVED','SCHEDULED','PUBLISHED','REJECTED','ARCHIVED');
  CREATE TYPE contact_type   AS ENUM ('LEAD','CUSTOMER','VENDOR','PARTNER');
  CREATE TYPE contact_status AS ENUM ('ACTIVE','INACTIVE','ARCHIVED');
  CREATE TYPE deal_stage     AS ENUM ('LEAD','QUALIFIED','PROPOSAL','NEGOTIATION','CLOSED_WON','CLOSED_LOST');
  CREATE TYPE task_status    AS ENUM ('TODO','IN_PROGRESS','REVIEW','DONE','CANCELED');
  CREATE TYPE task_priority  AS ENUM ('LOW','MEDIUM','HIGH','URGENT');
  CREATE TYPE attendance_status    AS ENUM ('PRESENT','ABSENT','LATE','EXCUSED');
  CREATE TYPE payment_status       AS ENUM ('PAID','UNPAID','PARTIAL','OVERDUE','WAIVED');
  CREATE TYPE notification_type    AS ENUM ('INFO','SUCCESS','WARNING','ERROR','BILLING','SYSTEM');
  CREATE TYPE integration_provider AS ENUM ('GOOGLE_SHEETS','SLACK','ZAPIER','AMAZON_SP_API','META_ADS','GOOGLE_ADS');
  CREATE TYPE integration_status   AS ENUM ('CONNECTED','DISCONNECTED','ERROR','PENDING');
  CREATE TYPE amazon_report_type   AS ENUM ('SALES','INVENTORY','ADVERTISING','FBA_FEES','BUSINESS_REPORT','WBR','ASIN_PERFORMANCE','PROFIT_LOSS');
  CREATE TYPE gender               AS ENUM ('MALE','FEMALE','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── updated_at trigger ──────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- helper macro to attach trigger
CREATE OR REPLACE FUNCTION create_updated_at_trigger(tbl TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER trg_%s_updated_at
     BEFORE UPDATE ON %I
     FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
    tbl, tbl
  );
END; $$;

-- ─── USERS ───────────────────────────────────────────────────

CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            VARCHAR(320) NOT NULL,
  full_name        VARCHAR(255) NOT NULL,
  avatar_url       TEXT,
  phone            VARCHAR(50),
  password_hash    TEXT,
  status           user_status NOT NULL DEFAULT 'PENDING',
  email_verified_at TIMESTAMPTZ,
  last_login_at    TIMESTAMPTZ,
  last_login_ip    VARCHAR(45),
  mfa_enabled      BOOLEAN NOT NULL DEFAULT false,
  mfa_secret       TEXT,
  preferences      JSONB NOT NULL DEFAULT '{}',
  locale           VARCHAR(10) NOT NULL DEFAULT 'ar',
  timezone         VARCHAR(100) NOT NULL DEFAULT 'Asia/Riyadh',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ,
  CONSTRAINT users_email_unique UNIQUE (email)
);
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_status ON users(status);
SELECT create_updated_at_trigger('users');

CREATE TABLE user_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token         VARCHAR(512) NOT NULL UNIQUE,
  refresh_token VARCHAR(512) NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token   ON user_sessions(token);

CREATE TABLE password_resets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(256) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pw_resets_token ON password_resets(token);

-- ─── TENANTS ─────────────────────────────────────────────────

CREATE TABLE tenants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  slug             VARCHAR(100) NOT NULL UNIQUE,
  type             tenant_type NOT NULL DEFAULT 'CLIENT',
  status           tenant_status NOT NULL DEFAULT 'PENDING',
  parent_tenant_id UUID REFERENCES tenants(id),
  logo_url         TEXT,
  settings         JSONB NOT NULL DEFAULT '{}',
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tenants_slug   ON tenants(slug);
CREATE INDEX idx_tenants_type   ON tenants(type);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_parent ON tenants(parent_tenant_id);
SELECT create_updated_at_trigger('tenants');

CREATE TABLE agencies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  name          VARCHAR(255) NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES users(id),
  billing_email VARCHAR(320) NOT NULL,
  phone         VARCHAR(50),
  website       TEXT,
  country       VARCHAR(100),
  status        tenant_status NOT NULL DEFAULT 'ACTIVE',
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agencies_tenant ON agencies(tenant_id);
SELECT create_updated_at_trigger('agencies');

CREATE TABLE clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id),
  agency_id  UUID REFERENCES agencies(id),
  name       VARCHAR(255) NOT NULL,
  industry   VARCHAR(100),
  country    VARCHAR(100),
  website    TEXT,
  status     tenant_status NOT NULL DEFAULT 'ACTIVE',
  settings   JSONB NOT NULL DEFAULT '{}',
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_agency ON clients(agency_id);
SELECT create_updated_at_trigger('clients');

-- ─── RBAC ────────────────────────────────────────────────────

CREATE TABLE roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL UNIQUE,
  display_name    VARCHAR(255) NOT NULL,
  display_name_ar VARCHAR(255),
  description     TEXT,
  system_role     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          VARCHAR(200) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description  TEXT,
  module       module_key,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_permissions_module ON permissions(module);

CREATE TABLE role_permissions (
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE memberships (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id),
  tenant_id          UUID NOT NULL REFERENCES tenants(id),
  agency_id          UUID REFERENCES agencies(id),
  client_id          UUID REFERENCES clients(id),
  role               membership_role NOT NULL,
  role_id            UUID REFERENCES roles(id),
  status             membership_status NOT NULL DEFAULT 'PENDING',
  invited_by         UUID REFERENCES users(id),
  invited_at         TIMESTAMPTZ,
  joined_at          TIMESTAMPTZ,
  custom_permissions JSONB NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, tenant_id, agency_id, client_id)
);
CREATE INDEX idx_memberships_user   ON memberships(user_id);
CREATE INDEX idx_memberships_tenant ON memberships(tenant_id);
CREATE INDEX idx_memberships_role   ON memberships(role);
SELECT create_updated_at_trigger('memberships');

-- ─── MODULES & BILLING ───────────────────────────────────────

CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         module_key NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  name_ar     VARCHAR(255),
  description TEXT,
  status      module_status NOT NULL DEFAULT 'ACTIVE',
  base_price  NUMERIC(10,2),
  icon        TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tenant_modules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  module_id    UUID NOT NULL REFERENCES modules(id),
  status       tenant_module_status NOT NULL DEFAULT 'TRIAL',
  limits       JSONB NOT NULL DEFAULT '{}',
  settings     JSONB NOT NULL DEFAULT '{}',
  trial_ends_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, module_id)
);
CREATE INDEX idx_tenant_modules_tenant ON tenant_modules(tenant_id);
SELECT create_updated_at_trigger('tenant_modules');

CREATE TABLE plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  display_name     VARCHAR(255) NOT NULL,
  display_name_ar  VARCHAR(255),
  description      TEXT,
  billing_interval billing_interval NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  currency         VARCHAR(3) NOT NULL DEFAULT 'USD',
  features         JSONB NOT NULL DEFAULT '[]',
  limits           JSONB NOT NULL DEFAULT '{}',
  status           plan_status NOT NULL DEFAULT 'ACTIVE',
  is_popular       BOOLEAN NOT NULL DEFAULT false,
  sort_order       INT NOT NULL DEFAULT 0,
  stripe_price_id  VARCHAR(200),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('plans');

CREATE TABLE plan_modules (
  plan_id   UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  limits    JSONB NOT NULL DEFAULT '{}',
  PRIMARY KEY (plan_id, module_id)
);

CREATE TABLE subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id),
  plan_id                  UUID NOT NULL REFERENCES plans(id),
  module_id                UUID REFERENCES modules(id),
  provider                 billing_provider NOT NULL DEFAULT 'STRIPE',
  provider_subscription_id VARCHAR(300),
  provider_customer_id     VARCHAR(300),
  status                   subscription_status NOT NULL DEFAULT 'ACTIVE',
  current_period_start     TIMESTAMPTZ NOT NULL,
  current_period_end       TIMESTAMPTZ NOT NULL,
  cancel_at_period_end     BOOLEAN NOT NULL DEFAULT false,
  canceled_at              TIMESTAMPTZ,
  trial_start              TIMESTAMPTZ,
  trial_end                TIMESTAMPTZ,
  metadata                 JSONB NOT NULL DEFAULT '{}',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_tenant   ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status   ON subscriptions(status);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider_subscription_id);
SELECT create_updated_at_trigger('subscriptions');

CREATE TABLE invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  subscription_id     UUID REFERENCES subscriptions(id),
  amount              NUMERIC(10,2) NOT NULL,
  currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
  status              invoice_status NOT NULL DEFAULT 'OPEN',
  provider_invoice_id VARCHAR(300),
  invoice_url         TEXT,
  pdf_url             TEXT,
  line_items          JSONB NOT NULL DEFAULT '[]',
  issued_at           TIMESTAMPTZ NOT NULL,
  due_at              TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ─── AUDIT & FILES ────────────────────────────────────────────

CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  tenant_id     UUID REFERENCES tenants(id),
  action        VARCHAR(200) NOT NULL,
  entity_type   VARCHAR(100),
  entity_id     UUID,
  old_values    JSONB,
  new_values    JSONB,
  metadata      JSONB NOT NULL DEFAULT '{}',
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  severity      VARCHAR(20) NOT NULL DEFAULT 'info',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_tenant    ON audit_logs(tenant_id);
CREATE INDEX idx_audit_actor     ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_action    ON audit_logs(action);
CREATE INDEX idx_audit_entity    ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created   ON audit_logs(created_at DESC);

CREATE TABLE files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  client_id     UUID REFERENCES clients(id),
  uploaded_by   UUID NOT NULL REFERENCES users(id),
  module_key    module_key,
  filename      VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  mime_type     VARCHAR(200) NOT NULL,
  size          BIGINT NOT NULL,
  storage_key   TEXT NOT NULL,
  storage_url   TEXT,
  status        file_status NOT NULL DEFAULT 'PENDING',
  scan_status   VARCHAR(50),
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_files_tenant ON files(tenant_id);
CREATE INDEX idx_files_client ON files(client_id);
CREATE INDEX idx_files_module ON files(module_key);
SELECT create_updated_at_trigger('files');

-- ─── AI LAYER ─────────────────────────────────────────────────

CREATE TABLE ai_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  user_id       UUID NOT NULL REFERENCES users(id),
  module_key    module_key NOT NULL,
  provider      ai_provider NOT NULL,
  model         VARCHAR(100) NOT NULL,
  input_tokens  INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  total_tokens  INT NOT NULL DEFAULT 0,
  cost_usd      NUMERIC(10,6) NOT NULL DEFAULT 0,
  status        ai_request_status NOT NULL DEFAULT 'PENDING',
  duration_ms   INT,
  error_message TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_tenant    ON ai_requests(tenant_id);
CREATE INDEX idx_ai_user      ON ai_requests(user_id);
CREATE INDEX idx_ai_module    ON ai_requests(module_key);
CREATE INDEX idx_ai_created   ON ai_requests(created_at DESC);

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  client_id   UUID REFERENCES clients(id),
  module_key  module_key NOT NULL,
  title       VARCHAR(500) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  status      report_status NOT NULL DEFAULT 'PENDING',
  data        JSONB NOT NULL DEFAULT '{}',
  summary     TEXT,
  file_url    TEXT,
  created_by  UUID NOT NULL REFERENCES users(id),
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reports_tenant ON reports(tenant_id);
CREATE INDEX idx_reports_module ON reports(module_key);
SELECT create_updated_at_trigger('reports');

CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id),
  user_id    UUID NOT NULL REFERENCES users(id),
  title      VARCHAR(500) NOT NULL,
  body       TEXT NOT NULL,
  type       notification_type NOT NULL DEFAULT 'INFO',
  action_url TEXT,
  metadata   JSONB NOT NULL DEFAULT '{}',
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notif_user   ON notifications(tenant_id, user_id);
CREATE INDEX idx_notif_unread ON notifications(read_at) WHERE read_at IS NULL;

CREATE TABLE integrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  provider              integration_provider NOT NULL,
  status                integration_status NOT NULL DEFAULT 'DISCONNECTED',
  credentials_encrypted TEXT,
  settings              JSONB NOT NULL DEFAULT '{}',
  last_sync_at          TIMESTAMPTZ,
  error_message         TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, provider)
);
SELECT create_updated_at_trigger('integrations');

-- ─── MODULE: AMAZON AI ────────────────────────────────────────

CREATE TABLE amazon_accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  client_id   UUID NOT NULL REFERENCES clients(id),
  marketplace VARCHAR(50) NOT NULL,
  seller_name VARCHAR(500) NOT NULL,
  seller_id   VARCHAR(100),
  status      tenant_status NOT NULL DEFAULT 'ACTIVE',
  settings    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_amz_accounts_tenant ON amazon_accounts(tenant_id);
CREATE INDEX idx_amz_accounts_client ON amazon_accounts(client_id);
SELECT create_updated_at_trigger('amazon_accounts');

CREATE TABLE amazon_uploads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amazon_account_id UUID NOT NULL REFERENCES amazon_accounts(id),
  file_id           UUID NOT NULL REFERENCES files(id),
  report_type       amazon_report_type NOT NULL,
  date_range_start  DATE,
  date_range_end    DATE,
  status            file_status NOT NULL DEFAULT 'PENDING',
  parsed_data       JSONB,
  parse_errors      JSONB,
  row_count         INT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_amz_uploads_account ON amazon_uploads(amazon_account_id);
SELECT create_updated_at_trigger('amazon_uploads');

CREATE TABLE amazon_metrics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amazon_account_id UUID NOT NULL REFERENCES amazon_accounts(id),
  date             DATE NOT NULL,
  asin             VARCHAR(20),
  sku              VARCHAR(200),
  metric_key       VARCHAR(200) NOT NULL,
  metric_value     NUMERIC(20,6) NOT NULL,
  currency         VARCHAR(3),
  metadata         JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_amz_metrics_account_date ON amazon_metrics(amazon_account_id, date DESC);
CREATE INDEX idx_amz_metrics_asin         ON amazon_metrics(asin) WHERE asin IS NOT NULL;
CREATE INDEX idx_amz_metrics_key          ON amazon_metrics(metric_key);

-- ─── MODULE: CONTENT AI ───────────────────────────────────────

CREATE TABLE content_projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  client_id   UUID REFERENCES clients(id),
  name        VARCHAR(500) NOT NULL,
  description TEXT,
  brand_voice JSONB NOT NULL DEFAULT '{}',
  audience    JSONB NOT NULL DEFAULT '{}',
  platforms   JSONB NOT NULL DEFAULT '[]',
  languages   JSONB NOT NULL DEFAULT '["ar"]',
  status      VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cp_tenant ON content_projects(tenant_id);
SELECT create_updated_at_trigger('content_projects');

CREATE TABLE content_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES content_projects(id),
  created_by   UUID NOT NULL REFERENCES users(id),
  type         content_item_type NOT NULL,
  platform     VARCHAR(100),
  title        VARCHAR(500) NOT NULL,
  body         TEXT NOT NULL,
  hashtags     JSONB NOT NULL DEFAULT '[]',
  media_urls   JSONB NOT NULL DEFAULT '[]',
  status       content_item_status NOT NULL DEFAULT 'DRAFT',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ci_project   ON content_items(project_id);
CREATE INDEX idx_ci_status    ON content_items(status);
CREATE INDEX idx_ci_scheduled ON content_items(scheduled_at) WHERE scheduled_at IS NOT NULL;
SELECT create_updated_at_trigger('content_items');

-- ─── MODULE: BUSINESS AI ──────────────────────────────────────

CREATE TABLE business_contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id),
  client_id  UUID REFERENCES clients(id),
  name       VARCHAR(500) NOT NULL,
  email      VARCHAR(320),
  phone      VARCHAR(50),
  company    VARCHAR(500),
  type       contact_type NOT NULL DEFAULT 'LEAD',
  status     contact_status NOT NULL DEFAULT 'ACTIVE',
  tags       JSONB NOT NULL DEFAULT '[]',
  notes      TEXT,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_biz_contacts_tenant ON business_contacts(tenant_id);
CREATE INDEX idx_biz_contacts_type   ON business_contacts(type);
SELECT create_updated_at_trigger('business_contacts');

CREATE TABLE business_deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id),
  contact_id          UUID NOT NULL REFERENCES business_contacts(id),
  title               VARCHAR(500) NOT NULL,
  value               NUMERIC(15,2),
  currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
  stage               deal_stage NOT NULL DEFAULT 'LEAD',
  probability         INT NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  closed_at           TIMESTAMPTZ,
  owner_user_id       UUID NOT NULL REFERENCES users(id),
  notes               TEXT,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_biz_deals_tenant ON business_deals(tenant_id);
CREATE INDEX idx_biz_deals_stage  ON business_deals(stage);
SELECT create_updated_at_trigger('business_deals');

CREATE TABLE business_tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  assigned_to  UUID REFERENCES users(id),
  title        VARCHAR(500) NOT NULL,
  description  TEXT,
  status       task_status NOT NULL DEFAULT 'TODO',
  priority     task_priority NOT NULL DEFAULT 'MEDIUM',
  due_date     TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  entity_type  VARCHAR(50),
  entity_id    UUID,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_biz_tasks_tenant   ON business_tasks(tenant_id);
CREATE INDEX idx_biz_tasks_assigned ON business_tasks(assigned_to);
CREATE INDEX idx_biz_tasks_status   ON business_tasks(status);
SELECT create_updated_at_trigger('business_tasks');

-- ─── MODULE: SCHOOL AI ────────────────────────────────────────

CREATE TABLE school_students (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  client_id    UUID NOT NULL REFERENCES clients(id),
  full_name    VARCHAR(500) NOT NULL,
  student_code VARCHAR(50),
  date_of_birth DATE,
  gender       gender,
  grade        VARCHAR(100),
  class_room   VARCHAR(100),
  status       VARCHAR(50) NOT NULL DEFAULT 'active',
  enrolled_at  DATE,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_school_students_tenant ON school_students(tenant_id);
CREATE INDEX idx_school_students_client ON school_students(client_id);
SELECT create_updated_at_trigger('school_students');

CREATE TABLE school_guardians (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL,
  student_id   UUID NOT NULL REFERENCES school_students(id),
  full_name    VARCHAR(500) NOT NULL,
  phone        VARCHAR(50) NOT NULL,
  email        VARCHAR(320),
  relationship VARCHAR(100) NOT NULL,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_guardians_student ON school_guardians(student_id);

CREATE TABLE school_attendance (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  student_id  UUID NOT NULL REFERENCES school_students(id),
  date        DATE NOT NULL,
  status      attendance_status NOT NULL,
  check_in_at TIMESTAMPTZ,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, date)
);
CREATE INDEX idx_attendance_tenant_date ON school_attendance(tenant_id, date DESC);

CREATE TABLE school_payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  student_id  UUID NOT NULL REFERENCES school_students(id),
  amount      NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency    VARCHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT,
  status      payment_status NOT NULL DEFAULT 'UNPAID',
  due_date    DATE NOT NULL,
  paid_at     TIMESTAMPTZ,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_school_payments_tenant  ON school_payments(tenant_id);
CREATE INDEX idx_school_payments_student ON school_payments(student_id);
CREATE INDEX idx_school_payments_status  ON school_payments(status);
SELECT create_updated_at_trigger('school_payments');

-- ─── MODULE: REPORTING AI ─────────────────────────────────────

CREATE TABLE reporting_datasets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id),
  file_id          UUID NOT NULL REFERENCES files(id),
  name             VARCHAR(500) NOT NULL,
  description      TEXT,
  schema           JSONB NOT NULL DEFAULT '{}',
  parsed_rows_count INT,
  status           file_status NOT NULL DEFAULT 'PENDING',
  ai_insights      JSONB,
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_rd_tenant ON reporting_datasets(tenant_id);
SELECT create_updated_at_trigger('reporting_datasets');

CREATE TABLE reporting_dashboards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id),
  title      VARCHAR(500) NOT NULL,
  title_ar   VARCHAR(500),
  config     JSONB NOT NULL DEFAULT '{}',
  is_public  BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_rdash_tenant ON reporting_dashboards(tenant_id);
SELECT create_updated_at_trigger('reporting_dashboards');

-- ─── ROW-LEVEL SECURITY (MVP stubs) ───────────────────────────
-- Enable RLS on tenant-scoped tables; enforce via app-level tenant_id filter.

ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships        ENABLE ROW LEVEL SECURITY;
ALTER TABLE files              ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_accounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_uploads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_metrics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_contacts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_deals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_attendance  ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_payments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporting_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporting_dashboards ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (Prisma uses this role).
-- Production: create a restricted role and enforce tenant_id = current_setting('app.tenant_id')
