# Referência de tabelas

Colunas, tipos e origem no código TypeORM. Todas as tabelas incluem as colunas base: `id`, `created_at`, `updated_at`, `deleted_at` (ver [relationships.md](./relationships.md#convenções-globais)).

---

## Enums

### `event_modality_enum` — coluna `events.modality`

| Valor     | Constante                         |
| --------- | --------------------------------- |
| `online`  | `EventModality.ONLINE`            |
| `offline` | `EventModality.OFFLINE` (default) |

**Arquivo:** `src/modules/events/infra/orm/enums/event-modality.enum.ts`

### `order_status_enum` — coluna `orders.status`

| Valor       | Descrição resumida    |
| ----------- | --------------------- |
| `PENDING`   | Aguardando pagamento  |
| `CONFIRMED` | Compra confirmada     |
| `EXPIRED`   | Expirou sem pagamento |
| `CANCELLED` | Cancelado             |
| `REFUNDED`  | Estornado             |
| `DISPUTED`  | Em disputa            |

**Arquivo:** `src/modules/events/infra/orm/enums/order-status.enum.ts`  
**Doc de fluxo:** `docs/business rule/order-status.md`

### `payment_method_enum` — coluna `payments.method`

| Valor    |
| -------- |
| `PIX`    |
| `CREDIT` |
| `DEBIT`  |

**Arquivo:** `src/modules/payments/infra/orm/enums/payment-method.enum.ts`

### `payment_status_enum` — coluna `payments.status`

| Valor             |
| ----------------- |
| `PENDING`         |
| `REQUIRES_ACTION` |
| `PROCESSING`      |
| `AUTHORIZED`      |
| `PAID`            |
| `EXPIRED`         |
| `CANCELLED`       |
| `REFUNDED`        |
| `DISPUTED`        |
| `UNDER_DISPUTE`   |
| `REDEEMED`        |
| `APPROVED`        |
| `FAILED`          |

**Arquivo:** `src/modules/payments/infra/orm/enums/payment-status.enum.ts`

### `TicketAvailability` (não persistido)

Enum usado apenas em código (`resolveTicketAvaliability`). Não existe coluna no banco.

**Arquivo:** `src/modules/events/infra/orm/enums/ticket-availability.enum.ts`

---

## `users`

| Coluna        | Tipo PG   | Null     | Observação                                  |
| ------------- | --------- | -------- | ------------------------------------------- |
| `email`       | `varchar` | NOT NULL | UNIQUE                                      |
| `password`    | `varchar` | NOT NULL | `select: false` — omitido em queries padrão |
| `phone`       | `varchar` | NULL     |                                             |
| `cpf`         | `varchar` | NULL     |                                             |
| `institution` | `varchar` | NULL     |                                             |
| `profession`  | `varchar` | NULL     |                                             |

**Entidade:** `src/modules/users/infra/orm/entities/user.entity.ts`

---

## `organizations`

| Coluna          | Tipo PG   | Null     | Observação                                               |
| --------------- | --------- | -------- | -------------------------------------------------------- |
| `name`          | `varchar` | NOT NULL |                                                          |
| `configuration` | `jsonb`   | NULL     | Limites e configs da org (ex: `max_batch_base_quantity`) |

**Entidade:** `src/modules/users/infra/orm/entities/organization.entity.ts`

---

## `user_organizations`

| Coluna            | Tipo PG | FK                   | Null     |
| ----------------- | ------- | -------------------- | -------- |
| `user_id`         | `uuid`  | → `users.id`         | NOT NULL |
| `organization_id` | `uuid`  | → `organizations.id` | NOT NULL |

**Entidade:** `src/modules/users/infra/orm/entities/user-organization.entity.ts`

---

## `permissions`

| Coluna        | Tipo PG   | Null     | Observação                                                                       |
| ------------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `description` | `varchar` | NOT NULL | Valores sincronizados via `SyncPermissionsService` (`PermissionDescriptionEnum`) |

**Entidade:** `src/modules/users/infra/orm/entities/permission.entity.ts`

---

## `user_permissions`

| Coluna            | Tipo PG | FK                   | Null     |
| ----------------- | ------- | -------------------- | -------- |
| `user_id`         | `uuid`  | → `users.id`         | NOT NULL |
| `organization_id` | `uuid`  | → `organizations.id` | NOT NULL |
| `permission_id`   | `uuid`  | → `permissions.id`   | NOT NULL |

**Unique:** `(user_id, organization_id, permission_id)`

**Entidade:** `src/modules/users/infra/orm/entities/user-permission.entity.ts`

---

## `organization_roles`

| Coluna            | Tipo PG   | FK                   | Null     |
| ----------------- | --------- | -------------------- | -------- |
| `name`            | `varchar` |                      | NOT NULL |
| `description`     | `varchar` |                      | NOT NULL |
| `organization_id` | `uuid`    | → `organizations.id` | NOT NULL |

**Unique:** `(organization_id, name)`

**Entidade:** `src/modules/users/infra/orm/entities/organization-role.entity.ts`

---

## `organization_role_permissions`

| Coluna                 | Tipo PG | FK                        | Null     |
| ---------------------- | ------- | ------------------------- | -------- |
| `organization_role_id` | `uuid`  | → `organization_roles.id` | NOT NULL |
| `permission_id`        | `uuid`  | → `permissions.id`        | NOT NULL |

**Unique:** `(organization_role_id, permission_id)`

**Entidade:** `src/modules/users/infra/orm/entities/organization-role-permission.entity.ts`

---

## `files`

| Coluna      | Tipo PG   | Null     | Observação                  |
| ----------- | --------- | -------- | --------------------------- |
| `path`      | `varchar` | NOT NULL | UNIQUE — caminho no storage |
| `mime_type` | `varchar` | NOT NULL |                             |

**Entidade:** `src/modules/files/infra/orm/entities/file.entity.ts` (classe `StoredFile`)

---

## `addresses`

| Coluna     | Tipo PG   | Null     |
| ---------- | --------- | -------- |
| `street`   | `varchar` | NOT NULL |
| `number`   | `varchar` | NOT NULL |
| `city`     | `varchar` | NOT NULL |
| `state`    | `varchar` | NOT NULL |
| `country`  | `varchar` | NOT NULL |
| `zip_code` | `varchar` | NOT NULL |

**Entidade:** `src/modules/events/infra/orm/entities/address.entity.ts`

---

## `events`

| Coluna            | Tipo PG               | FK                   | Null     | Observação                                       |
| ----------------- | --------------------- | -------------------- | -------- | ------------------------------------------------ |
| `name`            | `varchar`             |                      | NOT NULL |                                                  |
| `description`     | `text`                |                      | NOT NULL |                                                  |
| `organization_id` | `uuid`                | → `organizations.id` | NOT NULL |                                                  |
| `start_date`      | `timestamptz`         |                      | NOT NULL |                                                  |
| `end_date`        | `timestamptz`         |                      | NOT NULL |                                                  |
| `modality`        | `event_modality_enum` |                      | NOT NULL | default `offline`                                |
| `configuration`   | `jsonb`               |                      | NULL     | substitui tabela `event_configurations` removida |
| `address_id`      | `uuid`                | → `addresses.id`     | NULL     | OneToOne — FK nesta tabela                       |

**Entidade:** `src/modules/events/infra/orm/entities/event.entity.ts`

---

## `activities`

Catálogo reutilizável de atividades da organização (workshops, palestras, etc.).

| Coluna            | Tipo PG   | FK                   | Null     |
| ----------------- | --------- | -------------------- | -------- |
| `name`            | `varchar` |                      | NOT NULL |
| `description`     | `text`    |                      | NOT NULL |
| `organization_id` | `uuid`    | → `organizations.id` | NOT NULL |

**Entidade:** `src/modules/events/infra/orm/entities/activity.entity.ts`

---

## `event_activities`

Instância de uma `activity` dentro de um `event`.

| Coluna              | Tipo PG       | FK                | Null     | Observação                                                   |
| ------------------- | ------------- | ----------------- | -------- | ------------------------------------------------------------ |
| `hours_to_retrieve` | `integer`     |                   | NULL     | Horas antes/para retirar vaga (regra ainda não automatizada) |
| `max_participants`  | `integer`     |                   | NOT NULL | Define quantos `event_activity_presences` são criados        |
| `start_date`        | `timestamptz` |                   | NOT NULL | Dentro do intervalo do evento                                |
| `end_date`          | `timestamptz` |                   | NOT NULL |                                                              |
| `event_id`          | `uuid`        | → `events.id`     | NOT NULL |                                                              |
| `activity_id`       | `uuid`        | → `activities.id` | NOT NULL |                                                              |

**Entidade:** `src/modules/events/infra/orm/entities/event-activity.entity.ts`

---

## `batches`

| Coluna          | Tipo PG         | FK            | Null     | Observação                        |
| --------------- | --------------- | ------------- | -------- | --------------------------------- |
| `base_quantity` | `integer`       |               | NOT NULL | Qtd de tickets gerados na criação |
| `price`         | `decimal(10,2)` |               | NOT NULL | Preço unitário do lote            |
| `event_id`      | `uuid`          | → `events.id` | NOT NULL |                                   |

**Entidade:** `src/modules/events/infra/orm/entities/batch.entity.ts`

---

## `orders`

| Coluna         | Tipo PG             | FK           | Null     | Observação                                      |
| -------------- | ------------------- | ------------ | -------- | ----------------------------------------------- |
| `total_amount` | `decimal(10,2)`     |              | NOT NULL | Normalmente = `batch.price` do ticket reservado |
| `user_id`      | `uuid`              | → `users.id` | NOT NULL | Comprador                                       |
| `status`       | `order_status_enum` |              | NOT NULL | Fonte de verdade para disponibilidade do ticket |

**Entidade:** `src/modules/events/infra/orm/entities/order.entity.ts`

---

## `tickets`

| Coluna     | Tipo PG | FK             | Null     | Observação                        |
| ---------- | ------- | -------------- | -------- | --------------------------------- |
| `batch_id` | `uuid`  | → `batches.id` | NOT NULL | Define preço e evento (via batch) |
| `order_id` | `uuid`  | → `orders.id`  | NULL     | **NULL = disponível** para venda  |

**Entidade:** `src/modules/events/infra/orm/entities/ticket.entity.ts`

---

## `event_activity_presences`

Slot de participação em uma atividade do evento.

| Coluna              | Tipo PG   | FK                      | Null     | Observação                 |
| ------------------- | --------- | ----------------------- | -------- | -------------------------- |
| `user_presence`     | `boolean` |                         | NOT NULL | default `false` — check-in |
| `event_activity_id` | `uuid`    | → `event_activities.id` | NOT NULL |                            |
| `order_id`          | `uuid`    | → `orders.id`           | NULL     | **NULL = slot livre**      |

**Entidade:** `src/modules/events/infra/orm/entities/event-activity-presence.entity.ts`

---

## `event_activity_invited`

| Coluna              | Tipo PG   | FK                      | Null     | Observação        |
| ------------------- | --------- | ----------------------- | -------- | ----------------- |
| `name`              | `varchar` |                         | NOT NULL | Nome do convidado |
| `institution`       | `varchar` |                         | NULL     |                   |
| `profession`        | `varchar` |                         | NULL     |                   |
| `event_activity_id` | `uuid`    | → `event_activities.id` | NOT NULL |                   |
| `user_id`           | `uuid`    | → `users.id`            | NULL     | Conta opcional    |

**Entidade:** `src/modules/events/infra/orm/entities/event-activity-invited.entity.ts`

---

## `payments`

| Coluna        | Tipo PG               | FK            | Null     | Observação       |
| ------------- | --------------------- | ------------- | -------- | ---------------- |
| `provider`    | `varchar`             |               | NOT NULL | Ex: `abacatepay` |
| `amount`      | `decimal(10,2)`       |               | NOT NULL |                  |
| `method`      | `payment_method_enum` |               | NOT NULL |                  |
| `status`      | `payment_status_enum` |               | NOT NULL |                  |
| `external_id` | `varchar`             |               | NULL     | ID no gateway    |
| `refunded_at` | `timestamptz`         |               | NULL     |                  |
| `order_id`    | `uuid`                | → `orders.id` | NOT NULL |                  |

**Entidade:** `src/modules/payments/infra/orm/entities/payment.entity.ts`

---

## `card_informations`

| Coluna        | Tipo PG   | FK              | Null     | Observação        |
| ------------- | --------- | --------------- | -------- | ----------------- |
| `last4`       | `char(4)` |                 | NOT NULL | Últimos 4 dígitos |
| `brand`       | `varchar` |                 | NULL     | Bandeira          |
| `exp_month`   | `integer` |                 | NOT NULL |                   |
| `exp_year`    | `integer` |                 | NOT NULL |                   |
| `holder_name` | `varchar` |                 | NULL     |                   |
| `payment_id`  | `uuid`    | → `payments.id` | NOT NULL | UNIQUE — OneToOne |

**Entidade:** `src/modules/payments/infra/orm/entities/card-information.entity.ts`

---

## Contagem de tabelas

| Módulo                | Tabelas |
| --------------------- | ------- |
| Users & Authorization | 7       |
| Files                 | 1       |
| Events                | 9       |
| Payments              | 2       |
| **Total**             | **19**  |

Mais 4 tipos ENUM no PostgreSQL (`event_modality`, `order_status`, `payment_method`, `payment_status`).
