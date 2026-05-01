# Status

## Visao geral

O fluxo separa estado por dimensao:

- `OrderStatus` representa o estado comercial da compra.
- `PaymentStatus` representa o estado financeiro de uma tentativa de pagamento.
- `TicketAvailability` representa a disponibilidade operacional do ticket, deduzida da `Order` associada.

Tickets nao persistem status proprio. A disponibilidade e calculada com `resolveTicketAvailability(ticket.order?.status ?? null)`, mantendo `Order` como fonte de verdade para uso, reserva e liberacao do ticket.

## Order

| Status      | Descricao                                                         | Gatilho                                                                         |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `PENDING`   | Compra criada e aguardando conclusao de pagamento ou confirmacao. | Checkout iniciado, Pix criado, cartao aguardando confirmacao ou captura.        |
| `CONFIRMED` | Compra confirmada comercialmente.                                 | Pagamento pago ou capturado com sucesso.                                        |
| `EXPIRED`   | Compra expirou antes da confirmacao.                              | Pix expirado ou janela de pagamento encerrada.                                  |
| `CANCELLED` | Compra cancelada antes da confirmacao.                            | Cancelamento manual, abandono ou cancelamento pelo provedor antes de pagamento. |
| `REFUNDED`  | Compra confirmada teve o valor estornado.                         | Estorno total confirmado pelo provedor.                                         |
| `DISPUTED`  | Compra esta em disputa financeira.                                | Chargeback ou disputa aberta no provedor.                                       |

Fluxo textual:

```text
PENDING -> CONFIRMED -> REFUNDED | DISPUTED
PENDING -> EXPIRED | CANCELLED
```

## Payment

| Status            | Descricao                                      | Gatilho                                                                         |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `PENDING`         | Pagamento criado e ainda sem resultado final.  | Pix criado ou tentativa iniciada no provedor.                                   |
| `REQUIRES_ACTION` | Pagamento precisa de acao do comprador.        | Autenticacao 3DS ou etapa equivalente exigida pelo Stripe.                      |
| `PROCESSING`      | Provedor esta processando de forma assincrona. | Confirmacao pendente em metodo assincrono ou processamento interno do provedor. |
| `AUTHORIZED`      | Valor autorizado, mas ainda nao capturado.     | Cartao autorizado no Stripe com captura posterior.                              |
| `PAID`            | Pagamento liquidado ou capturado.              | Pix pago, cartao capturado ou pagamento confirmado pelo provedor.               |
| `EXPIRED`         | Pagamento expirou sem liquidacao.              | Pix venceu antes do pagamento.                                                  |
| `CANCELLED`       | Pagamento cancelado antes de liquidar.         | Cancelamento manual ou cancelamento aceito pelo provedor.                       |
| `REFUNDED`        | Pagamento estornado.                           | Estorno confirmado pelo provedor.                                               |
| `DISPUTED`        | Pagamento em disputa.                          | Chargeback ou disputa aberta.                                                   |
| `FAILED`          | Pagamento falhou definitivamente.              | Recusa, erro permanente ou falha retornada pelo provedor.                       |

Stripe usa principalmente `REQUIRES_ACTION`, `PROCESSING`, `AUTHORIZED`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED` e `DISPUTED`. Pix usa principalmente `PENDING`, `PAID`, `EXPIRED`, `CANCELLED`, `REFUNDED` e `FAILED`.

## Ticket

`TicketAvailability` nao e coluna de banco. Ele e deduzido de `order.status`:

| OrderStatus | TicketAvailability | Significado                                           |
| ----------- | ------------------ | ----------------------------------------------------- |
| Sem order   | `AVAILABLE`        | Ticket livre para nova compra.                        |
| `PENDING`   | `RESERVED`         | Ticket reservado enquanto a compra aguarda conclusao. |
| `CONFIRMED` | `USABLE`           | Ticket comprado e apto para uso.                      |
| `DISPUTED`  | `BLOCKED`          | Ticket bloqueado enquanto a disputa esta aberta.      |
| `EXPIRED`   | `AVAILABLE`        | Ticket liberado apos expiracao.                       |
| `CANCELLED` | `AVAILABLE`        | Ticket liberado apos cancelamento.                    |
| `REFUNDED`  | `AVAILABLE`        | Ticket liberado apos estorno.                         |

## Matriz de casos

| Caso                     | PaymentStatus     | OrderStatus | TicketAvailability |
| ------------------------ | ----------------- | ----------- | ------------------ |
| Pix criado               | `PENDING`         | `PENDING`   | `RESERVED`         |
| Pix pago                 | `PAID`            | `CONFIRMED` | `USABLE`           |
| Pix expirado             | `EXPIRED`         | `EXPIRED`   | `AVAILABLE`        |
| Pix cancelado            | `CANCELLED`       | `CANCELLED` | `AVAILABLE`        |
| Cartao com 3DS pendente  | `REQUIRES_ACTION` | `PENDING`   | `RESERVED`         |
| Processamento assincrono | `PROCESSING`      | `PENDING`   | `RESERVED`         |
| Cartao autorizado        | `AUTHORIZED`      | `PENDING`   | `RESERVED`         |
| Captura confirmada       | `PAID`            | `CONFIRMED` | `USABLE`           |
| Estorno confirmado       | `REFUNDED`        | `REFUNDED`  | `AVAILABLE`        |
| Chargeback aberto        | `DISPUTED`        | `DISPUTED`  | `BLOCKED`          |
| Falha definitiva         | `FAILED`          | `CANCELLED` | `AVAILABLE`        |
