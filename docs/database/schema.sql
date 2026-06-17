-- =============================================================================
-- Knex Flow — Database Schema (PostgreSQL)
-- =============================================================================
-- Gerado a partir das entidades TypeORM em src/**/infra/orm/entities/*.entity.ts
-- Base: BaseEntitySequentialGeneratedUUID (id UUID v7, timestamps, soft delete)
--
-- Uso:
--   psql -f docs/database/schema.sql
--   ou importe em ferramentas como DBeaver, pgAdmin, TablePlus
--
-- Nota: com DB_SYNCHRONIZE=true o TypeORM cria/atualiza o schema automaticamente.
-- Este arquivo é documentação de referência, não substitui migrations de produção.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUMs
-- -----------------------------------------------------------------------------

CREATE TYPE event_modality_enum AS ENUM ('online', 'offline');

CREATE TYPE order_status_enum AS ENUM (
  'PENDING',
  'CONFIRMED',
  'EXPIRED',
  'CANCELLED',
  'REFUNDED',
  'DISPUTED'
);

CREATE TYPE payment_method_enum AS ENUM ('PIX', 'CREDIT', 'DEBIT');

CREATE TYPE payment_status_enum AS ENUM (
  'PENDING',
  'REQUIRES_ACTION',
  'PROCESSING',
  'AUTHORIZED',
  'PAID',
  'EXPIRED',
  'CANCELLED',
  'REFUNDED',
  'DISPUTED',
  'UNDER_DISPUTE',
  'REDEEMED',
  'APPROVED',
  'FAILED'
);

-- TicketAvailability NÃO é coluna de banco — é valor derivado em resolveTicketAvaliability()

-- -----------------------------------------------------------------------------
-- Módulo: Users & Authorization
-- -----------------------------------------------------------------------------

CREATE TABLE users (
  id          UUID PRIMARY KEY,
  email       VARCHAR NOT NULL UNIQUE,
  password    VARCHAR NOT NULL,
  phone       VARCHAR,
  cpf         VARCHAR,
  institution VARCHAR,
  profession  VARCHAR,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE TABLE organizations (
  id            UUID PRIMARY KEY,
  name          VARCHAR NOT NULL,
  configuration JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE TABLE user_organizations (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users (id),
  organization_id UUID NOT NULL REFERENCES organizations (id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_user_organizations_user_id ON user_organizations (user_id);
CREATE INDEX idx_user_organizations_organization_id ON user_organizations (organization_id);

CREATE TABLE permissions (
  id          UUID PRIMARY KEY,
  description VARCHAR NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE TABLE user_permissions (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users (id),
  organization_id UUID NOT NULL REFERENCES organizations (id),
  permission_id   UUID NOT NULL REFERENCES permissions (id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  CONSTRAINT uq_user_permissions_user_org_permission
    UNIQUE (user_id, organization_id, permission_id)
);

CREATE INDEX idx_user_permissions_user_id ON user_permissions (user_id);
CREATE INDEX idx_user_permissions_organization_id ON user_permissions (organization_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions (permission_id);

CREATE TABLE organization_roles (
  id              UUID PRIMARY KEY,
  name            VARCHAR NOT NULL,
  description     VARCHAR NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations (id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  CONSTRAINT uq_organization_roles_org_name UNIQUE (organization_id, name)
);

CREATE INDEX idx_organization_roles_organization_id ON organization_roles (organization_id);

CREATE TABLE organization_role_permissions (
  id                   UUID PRIMARY KEY,
  organization_role_id UUID NOT NULL REFERENCES organization_roles (id),
  permission_id        UUID NOT NULL REFERENCES permissions (id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ,
  CONSTRAINT uq_organization_role_permissions_role_permission
    UNIQUE (organization_role_id, permission_id)
);

CREATE INDEX idx_organization_role_permissions_role_id
  ON organization_role_permissions (organization_role_id);
CREATE INDEX idx_organization_role_permissions_permission_id
  ON organization_role_permissions (permission_id);

-- -----------------------------------------------------------------------------
-- Módulo: Files
-- -----------------------------------------------------------------------------

CREATE TABLE files (
  id         UUID PRIMARY KEY,
  path       VARCHAR NOT NULL UNIQUE,
  mime_type  VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- Módulo: Events
-- -----------------------------------------------------------------------------

CREATE TABLE addresses (
  id         UUID PRIMARY KEY,
  street     VARCHAR NOT NULL,
  number     VARCHAR NOT NULL,
  city       VARCHAR NOT NULL,
  state      VARCHAR NOT NULL,
  country    VARCHAR NOT NULL,
  zip_code   VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE events (
  id              UUID PRIMARY KEY,
  name            VARCHAR NOT NULL,
  description     TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations (id),
  start_date      TIMESTAMPTZ NOT NULL,
  end_date        TIMESTAMPTZ NOT NULL,
  modality        event_modality_enum NOT NULL DEFAULT 'offline',
  configuration   JSONB,
  address_id      UUID REFERENCES addresses (id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_events_organization_id ON events (organization_id);
CREATE INDEX idx_events_address_id ON events (address_id);

CREATE TABLE activities (
  id              UUID PRIMARY KEY,
  name            VARCHAR NOT NULL,
  description     TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations (id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_activities_organization_id ON activities (organization_id);

CREATE TABLE event_activities (
  id                UUID PRIMARY KEY,
  hours_to_retrieve INTEGER,
  max_participants  INTEGER NOT NULL,
  start_date        TIMESTAMPTZ NOT NULL,
  end_date          TIMESTAMPTZ NOT NULL,
  event_id          UUID NOT NULL REFERENCES events (id),
  activity_id       UUID NOT NULL REFERENCES activities (id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_event_activities_event_id ON event_activities (event_id);
CREATE INDEX idx_event_activities_activity_id ON event_activities (activity_id);

CREATE TABLE batches (
  id            UUID PRIMARY KEY,
  base_quantity INTEGER NOT NULL,
  price         DECIMAL(10, 2) NOT NULL,
  event_id      UUID NOT NULL REFERENCES events (id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_batches_event_id ON batches (event_id);

CREATE TABLE orders (
  id           UUID PRIMARY KEY,
  total_amount DECIMAL(10, 2) NOT NULL,
  user_id      UUID NOT NULL REFERENCES users (id),
  status       order_status_enum NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);

CREATE TABLE tickets (
  id         UUID PRIMARY KEY,
  batch_id   UUID NOT NULL REFERENCES batches (id),
  order_id   UUID REFERENCES orders (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_tickets_batch_id ON tickets (batch_id);
CREATE INDEX idx_tickets_order_id ON tickets (order_id);

CREATE TABLE event_activity_presences (
  id                UUID PRIMARY KEY,
  user_presence     BOOLEAN NOT NULL DEFAULT FALSE,
  event_activity_id UUID NOT NULL REFERENCES event_activities (id),
  order_id          UUID REFERENCES orders (id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_event_activity_presences_event_activity_id
  ON event_activity_presences (event_activity_id);
CREATE INDEX idx_event_activity_presences_order_id
  ON event_activity_presences (order_id);

CREATE TABLE event_activity_invited (
  id                UUID PRIMARY KEY,
  name              VARCHAR NOT NULL,
  institution       VARCHAR,
  profession        VARCHAR,
  event_activity_id UUID NOT NULL REFERENCES event_activities (id),
  user_id           UUID REFERENCES users (id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_event_activity_invited_event_activity_id
  ON event_activity_invited (event_activity_id);
CREATE INDEX idx_event_activity_invited_user_id
  ON event_activity_invited (user_id);

-- -----------------------------------------------------------------------------
-- Módulo: Payments
-- -----------------------------------------------------------------------------

CREATE TABLE payments (
  id          UUID PRIMARY KEY,
  provider    VARCHAR NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  method      payment_method_enum NOT NULL,
  status      payment_status_enum NOT NULL,
  external_id VARCHAR,
  refunded_at TIMESTAMPTZ,
  order_id    UUID NOT NULL REFERENCES orders (id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_payments_order_id ON payments (order_id);
CREATE INDEX idx_payments_external_id ON payments (external_id);
CREATE INDEX idx_payments_status ON payments (status);

CREATE TABLE card_informations (
  id          UUID PRIMARY KEY,
  last4       CHAR(4) NOT NULL,
  brand       VARCHAR,
  exp_month   INTEGER NOT NULL,
  exp_year    INTEGER NOT NULL,
  holder_name VARCHAR,
  payment_id  UUID NOT NULL UNIQUE REFERENCES payments (id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_card_informations_payment_id ON card_informations (payment_id);
