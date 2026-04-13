# Módulo Payments — entidades ORM

Este documento descreve as entidades TypeORM em `src/modules/payments/infra/orm/entities` e como se relacionam com o módulo de eventos (`Order`).

## Visão geral

O módulo **payments** concentra o registo de cobranças e dados auxiliares. Por agora, cada pagamento está ligado a uma encomenda (`orders`) do módulo **events**: um utilizador pode ter várias tentativas ou registos de pagamento para a mesma ordem (reembolsos, nova tentativa, etc.), modelado como **1:N** entre `Order` e `Payment`.

Enums partilhados pelo modelo:

| Ficheiro                                   | Enum              | Uso                                                                                                        |
| ------------------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `infra/orm/enums/payment-provider.enum.ts` | `PaymentProvider` | Qual gateway processou (ex.: `STRIPE`, `ABACATEPAY`).                                                      |
| `infra/orm/enums/payment-method.enum.ts`   | `PaymentMethod`   | Meio do cliente: `PIX`, `CREDIT`, `DEBIT`.                                                                 |
| `infra/orm/enums/payment-status.enum.ts`   | `PaymentStatus`   | Estado interno do pagamento; o comentário no ficheiro indica alinhamento futuro com webhooks dos gateways. |

---

## `Payment` (`payments`)

Entidade principal: representa **uma cobrança** associada a uma ordem.

| Campo                                      | Tipo ORM                       | Descrição                                                    |
| ------------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `id`                                       | UUID (PK)                      | Identificador interno.                                       |
| `provider`                                 | enum `PaymentProvider`         | Gateway usado.                                               |
| `amount`                                   | `decimal(10,2)`                | Valor desta cobrança.                                        |
| `method`                                   | enum `PaymentMethod`           | PIX, crédito ou débito.                                      |
| `status`                                   | enum `PaymentStatus`           | Ciclo de vida (pendente, pago, falhou, etc.).                |
| `refunded_at`                              | `timestamp`, nullable          | Momento do reembolso, quando aplicável.                      |
| `created_at` / `updated_at` / `deleted_at` | auditoria                      | Soft delete em `deleted_at`.                                 |
| `order`                                    | `ManyToOne` → `Order`          | FK `order_id`; obrigatório.                                  |
| `card_information`                         | `OneToOne` → `CardInformation` | Opcional no domínio: só faz sentido para `CREDIT` / `DEBIT`. |

Relação inversa no módulo events: `Order.payments` (`OneToMany`).

---

## `CardInformation` (`card_informations`)

Extensão **opcional** de um pagamento: dados mínimos para identificar o cartão na aplicação **sem** armazenar dados sensíveis que implicariam escopo PCI elevado (PAN completo, CVV, track data, etc.).

### Relação com `Payment`

- **`Payment` 1 — 0..1 `CardInformation`**: um pagamento pode não ter linha em `card_informations` (ex.: PIX).
- O lado **dono** da FK é `CardInformation`: coluna **`payment_id`** com `@JoinColumn({ name: 'payment_id' })`.
- Em `Payment`, o `@OneToOne` sem `@JoinColumn` do lado do pagamento é o inverso da relação.

### Campos e intenção

| Campo                    | Descrição                                                                       |
| ------------------------ | ------------------------------------------------------------------------------- |
| `last4`                  | Apenas os **últimos 4 dígitos** do cartão (`char(4)`), para exibição e suporte. |
| `brand`                  | Bandeira (ex.: Visa), opcional.                                                 |
| `exp_month` / `exp_year` | Validade em campos separados (evita string ambígua e facilita validação).       |
| `holder_name`            | Nome no cartão, opcional.                                                       |
| Auditoria                | `created_at`, `updated_at`, `deleted_at` como nas outras entidades.             |

### O que **não** está (de propósito)

Não existem colunas para número completo do cartão, CVV ou dados magnéticos. Em integrações reais, identificadores fortes costumam vir do **gateway** (token / payment method id) e podem ser acrescentados em `Payment` (ou numa tabela de metadados) quando definirem o contrato com AbacatePay ou Stripe.

### Regra de negócio sugerida (fora do ORM)

- `method === PIX` → normalmente **sem** `CardInformation`.
- `method === CREDIT` ou `DEBIT` → pode existir **no máximo uma** `CardInformation` por `Payment` (garantida pelo `OneToOne` + unicidade de `payment_id` na FK).

---

## Referência de caminhos no repositório

- Entidades: `src/modules/payments/infra/orm/entities/`
- Enums: `src/modules/payments/infra/orm/enums/`
- Ordem com pagamentos: `src/modules/events/infra/orm/entities/order.entity.ts` (`payments`)
