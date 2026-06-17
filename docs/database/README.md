# Database — Knex Flow

Documentação do schema PostgreSQL derivada **integralmente** das entidades TypeORM do projeto.

## Arquivos

| Arquivo                                                        | Formato                                                                    | Para que serve                                                                |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`schema.sql`](./schema.sql)                                   | SQL (PostgreSQL)                                                           | DDL completo — importar em DBeaver, pgAdmin, `psql`, etc.                     |
| [`schema.dbml`](./schema.dbml)                                 | [DBML](https://www.dbml.org/)                                              | Diagrama ER interativo em [dbdiagram.io](https://dbdiagram.io)                |
| [`er-diagram.mmd`](./er-diagram.mmd)                           | [Mermaid ER](https://mermaid.js.org/syntax/entityRelationshipDiagram.html) | Diagrama em [mermaid.live](https://mermaid.live), GitHub, GitLab, VS Code     |
| [`knex-flow-schema.excalidraw`](./knex-flow-schema.excalidraw) | [Excalidraw](https://excalidraw.com)                                       | Visão por domínio — abra em excalidraw.com ou no VS Code                      |
| [`relationships.md`](./relationships.md)                       | Markdown                                                                   | **Explicação de cada relacionamento**, cardinalidade, FKs e fluxos de negócio |
| [`tables.md`](./tables.md)                                     | Markdown                                                                   | Referência coluna a coluna de cada tabela e enums                             |

## Como visualizar

### dbdiagram.io (recomendado para ER completo)

1. Acesse https://dbdiagram.io
2. **Import** → cole o conteúdo de `schema.dbml`
3. O diagrama com grupos (Users, Events, Payments, Files) é gerado automaticamente

### Mermaid Live

1. Acesse https://mermaid.live
2. Cole o conteúdo de `er-diagram.mmd`
3. Exporte PNG/SVG se precisar

### Excalidraw

1. Acesse https://excalidraw.com → **Open** → selecione `knex-flow-schema.excalidraw`
2. Ou use a extensão Excalidraw no VS Code

### GitHub / GitLab

Os arquivos `.md` com blocos `mermaid` renderizam diagramas nativamente. O `relationships.md` já inclui um flowchart de domínios.

## Modelo mental

```text
Organization
├── users (via user_organizations)
├── permissions (via user_permissions / organization_roles)
├── activities (catálogo)
└── events
    ├── address (opcional)
    ├── batches → tickets
    ├── event_activities (activity instanciada)
    │   ├── event_activity_presences (slots de vaga)
    │   └── event_activity_invited (convidados)
    └── configuration (jsonb no próprio event)

User → Order → Payment
              → Ticket (via order_id)
              → EventActivityPresence (slot, quando vinculado)
```

## Origem no código

- **Entidades:** `src/**/infra/orm/entities/*.entity.ts` (19 tabelas)
- **Base:** `src/shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity.ts`
- **Enums:** `src/**/infra/orm/enums/*.enum.ts`
- **Config ORM:** `src/config/typeorm.config.ts` (`DB_SYNCHRONIZE` controla auto-sync)
- **Disponibilidade de ticket (derivada):** `src/modules/events/utils/resolve-ticket-avaliability.ts`

## Manutenção

Ao alterar uma entidade TypeORM:

1. Atualize `schema.sql` e `schema.dbml`
2. Atualize `er-diagram.mmd` se mudar relacionamento
3. Documente em `relationships.md` e `tables.md`
4. Ajuste `knex-flow-schema.excalidraw` se a visão de domínio mudar

## Documentação relacionada

- [`docs/business rule/order-status.md`](../business%20rule/order-status.md) — máquina de estados Order / Payment / Ticket
- [`docs/business rule/o-porque-das-filas.md`](../business%20rule/o-porque-das-filas.md) — fluxo de reserva e pagamento
