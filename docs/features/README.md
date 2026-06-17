# Features — Knex Flow Backend

Documentação do **estado atual** da aplicação: o que ela faz hoje, como os fluxos se conectam e o que falta para um MVP funcional.

## Arquivos

| Documento                               | Conteúdo                                                 |
| --------------------------------------- | -------------------------------------------------------- |
| [Visão geral](./overview.md)            | O que é o produto, stack, módulos e fluxos implementados |
| [Inventário de API](./api-inventory.md) | Rotas HTTP e WebSocket disponíveis                       |
| [Gap para MVP](./mvp-gap.md)            | O que falta, priorizado, para fechar um MVP funcional    |
| [Bootstrap SQL](./bootstrap.sql)        | Template SQL para org + permissões no piloto             |

## Documentação relacionada

- [Schema do banco](../database/README.md)
- [Estados de pedido/pagamento/ticket](../database/relationships.md) (ver também matriz em `tables.md`)

## Resumo executivo

O Knex Flow Backend é uma API de **gestão e venda de ingressos para eventos**, com atividades programáveis (workshops/palestras), controle de permissões por organização e pagamento via PIX (AbacatePay).

**Hoje funciona bem o “caminho feliz” de venda** (reserva de ticket → pedido → PIX → confirmação), desde que organização e permissões já existam no banco.

**Os maiores bloqueios para MVP** são APIs ausentes de **criação de organização**, **vínculo usuário ↔ organização** e a **camada operacional do dia do evento** (presença, inscrição em atividades, expiração de pedidos).

## Status por área

| Área                   | Status              | Nota                                                |
| ---------------------- | ------------------- | --------------------------------------------------- |
| Autenticação           | ✅ Implementado     | Register, login, refresh, JWT                       |
| Organizações           | ⚠️ Parcial          | Sem CRUD de org nem membership via API              |
| Autorização            | ✅ Implementado     | Permissões, roles, guards por org                   |
| Catálogo de atividades | ✅ Implementado     | CRUD em `/organizations/.../activities`             |
| Eventos                | ✅ Implementado     | CRUD, config JSONB, lotes, programação              |
| Venda de ingressos     | ✅ Implementado     | WebSocket + fila + PIX + expiração de pedidos       |
| Pagamentos             | ⚠️ Parcial          | PIX + webhook `completed`; outros webhooks são stub |
| Dia do evento          | ❌ Não implementado | Presença, check-in                                  |
| Arquivos               | ✅ Implementado     | Upload MinIO                                        |
| Testes automatizados   | ❌ Não implementado | `npm test` é placeholder                            |
| Migrations             | ❌ Não implementado | `DB_SYNCHRONIZE=true` em dev                        |

Legenda: ✅ pronto · ⚠️ parcial · ❌ ausente
