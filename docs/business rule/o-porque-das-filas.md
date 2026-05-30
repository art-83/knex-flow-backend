# O por que das filas

## Visao geral

Em venda de ingressos com pagamento online, varias pessoas e processos automatizados podem alterar o **mesmo recurso ao mesmo tempo** (ultimo ticket, pedido pendente, status de pagamento). Sem coordenacao, o sistema entra em **race condition** — condicao de corrida — e passa a tomar decisoes com base em um estado que ja nao e mais verdadeiro.

As filas (BullMQ + Redis no Eventflow) existem para:

1. **Desacoplar** operacoes sensiveis do caminho sincrono (WebSocket / HTTP).
2. **Serializar ou limitar** o processamento de tarefas concorrentes quando configurado.
3. **Absorver picos** de demanda (abertura de vendas) sem derrubar a API.
4. **Retry** com backoff em falhas transientes (`bullmq.config.ts`).

Filas **nao substituem** regras de banco (transacao, lock, idempotencia). Sao uma camada de **orquestracao**; a correcao de negocio ainda depende do modelo `Order` / `Payment` / `Ticket` descrito em `order-status.md`.

---

## O que e race condition

**Race condition** ocorre quando o resultado de uma operacao depende da **ordem ou do timing** de eventos concorrentes, e o sistema nao garante uma ordem segura.

Padrao classico — **TOCTOU** (_time-of-check to time-of-use_):

1. Processo A **le** que o recurso esta livre.
2. Processo B **le** o mesmo estado (ainda livre).
3. Processo A **usa** o recurso (reserva).
4. Processo B **usa** o recurso (reserva de novo) → inconsistencia.

No Eventflow, o recurso disputado costuma ser um **ticket sem pedido** (`order_id` nulo) ou um **pedido** em transicao de status.

---

## Onde isso aparece no fluxo do Eventflow

```text
[Cliente] --WebSocket--> [API] --enfileira--> [Redis / BullMQ]
                                                    |
                                                    v
                                            [Worker: retrieve-available-tickets]
                                                    |
                                                    v
                              GetTicketsAvaliabilityAndMaybeCreateOrderService
                              (busca ticket livre → cria Order PENDING → vincula ticket)

[Cliente] --HTTP--> CreatePaymentService (Order PENDING → Payment PENDING → PIX)

[Provedor] --webhook--> AbacatepayCompletedWebhookHandler (Payment PAID → Order CONFIRMED)
```

Referencia de implementacao:

- Enfileiramento: `GetTicketsAvaliabilityAndMaybeCreateOrderServiceAdapter` → fila `RETRIEVE_AVAILABLE_TICKETS`
- Processamento: `RetrieveAvailableTicketsWorker`
- Reserva + pedido: `GetTicketsAvaliabilityAndMaybeCreateOrderService`
- Pagamento: `CreatePaymentService`
- Confirmacao: `AbacatepayCompletedWebhookHandler`

---

## Race condition na reserva de ingresso (antes do pagamento)

### Cenario

Restam ingressos com `order` nulo. Dois usuarios iniciam compra no mesmo segundo.

Sem protecao, ambos podem executar:

1. `find` ticket com `order_is_null: true` → **o mesmo ticket** (ou dois tickets se a query retornar o primeiro disponivel de forma nao atomica).
2. `create` `Order` com `PENDING`.
3. `update` ticket com `order`.

Resultados possiveis:

| Sintoma                                    | Impacto                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| Dois pedidos, um ticket                    | Um pagamento confirma; outro gera disputa, estorno ou cliente irritado. |
| Ticket vinculado duas vezes                | Dados inconsistentes; suporte manual.                                   |
| Dois pedidos, dois tickets quando havia um | Overselling (vendeu mais do que o lote permitia).                       |

O servico atual faz leitura e escrita em passos separados, sem transacao explicita nem `SELECT FOR UPDATE` documentados no repository — logo a corrida e um **risco real** sob carga, nao teorico.

### Por que a fila ajuda aqui

Fluxo atual:

1. WebSocket recebe pedido de disponibilidade.
2. API **nao** reserva na hora; cria **job** na fila.
3. **Worker** executa `GetTicketsAvaliabilityAndMaybeCreateOrderService` e responde via WebSocket.

Beneficios:

- **Backpressure**: pico de cliques vira fila em Redis em vez de saturar threads da API.
- **Processamento controlado**: workers podem rodar com concorrencia limitada (configuracao BullMQ), reduzindo colisoes simultaneas no mesmo trecho de codigo.
- **Retentativas**: falha transiente de banco pode reprocessar o job (`attempts: 3`, backoff exponencial).

Limitacao importante: fila **sozinha** nao elimina race se varios workers processam jobs em paralelo com concorrencia > 1. A garantia forte exige, no minimo:

- transacao com lock pessimista no ticket, ou
- constraint unica + tratamento de conflito, ou
- operacao atomica “claim ticket” (update … where order_id is null returning \*).

A fila e o **primeiro passo** de controle de concorrencia; o banco e a **fonte final** de verdade.

---

## Como race condition impacta o fluxo de pagamentos

Pagamento nao e apenas “chamar o gateway”. Ele se apoia em estados que outros fluxos podem alterar ao mesmo tempo. Ver `order-status.md`.

### 1. Pagar um pedido que ja nao deveria estar pendente

`CreatePaymentService` exige `order.status === PENDING`.

Corrida possivel:

- Usuario A e B reservam o **mesmo** ticket (falha na reserva).
- Dois `Order` `PENDING` existem; um ticket so pode ir para um.
- Ambos chamam `CreatePaymentService` para pedidos diferentes ligados ao mesmo estoque logico.

Impacto: **dois PIX** para a mesma unidade de estoque; um confirmara (`CONFIRMED` / `USABLE`), outro exigira estorno, cancelamento ou acao manual.

### 2. Pagamento duplicado no mesmo pedido

Sem idempotencia na criacao de pagamento:

- Cliente dispara dois POST (double-click, retry de rede).
- Dois registros `Payment` `PENDING` para o mesmo `order_id`.
- Dois QR Codes PIX.

Impacto: cobranca em duplicidade ou reconciliacao complexa com o provedor.

Mitigacao usual: chave de idempotencia por `order_id`, ou regra “no maximo um Payment PENDING ativo por pedido”.

### 3. Webhook de pagamento concorrente ou repetido

Provedores enviam webhooks **mais de uma vez** (retry, timeouts, multiplos nos).

`AbacatepayCompletedWebhookHandler` atualiza payment e order se ainda `PENDING` — comportamento parcialmente idempotente para `order`, mas dois deliveries simultaneos ainda podem gerar:

- duas escritas concorrentes no mesmo registro;
- leituras intermediarias com status inconsistente para outros consumers.

Impacto em cadeia:

| Estado esperado                       | Se a corrida falhar                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `Payment` `PAID`, `Order` `CONFIRMED` | Pedido confirmado sem pagamento registrado, ou pagamento PAID com order ainda PENDING |
| Ticket `USABLE`                       | Ticket reservado para outro enquanto pagamento confirma (overselling)                 |

Mitigacao: handler **idempotente** (mesmo `external_id` / evento nao reaplica efeito), preferencialmente em **transacao** unica: payment + order + efeitos no ticket.

### 4. Expiracao vs. confirmacao ao mesmo tempo

Fluxos assincronos tipicos:

- Job ou cron marca Pix / pedido como `EXPIRED` (ticket volta `AVAILABLE`).
- Webhook `PAID` chega no mesmo instante.

Sem ordem definida:

- Cliente paga, mas pedido expira → dinheiro recebido, ingresso liberado para outro.
- Ou ingresso vendido duas vezes apos expiracao mal sincronizada.

Impacto: **perda financeira**, **reputacao** e suporte manual — o pior tipo de bug em ticketing.

Filas ajudam a **ordenar** processamento (ex.: processar expiracao e webhooks na mesma fila por `order_id`), mas a regra de negocio deve definir **qual estado vence** (geralmente: pagamento confirmado pelo provedor com prova auditavel prevalece, com compensacao se ja houve revenda).

### 5. Corrida entre reserva (worker) e pagamento (HTTP)

Timeline:

1. Worker cria `Order` `PENDING` e associa ticket (`RESERVED`).
2. Antes do cliente abrir o PIX, outro fluxo expira o pedido ou admin cancela.
3. Cliente ainda chama `CreatePaymentService` com `order_id` antigo.

O guard `Order not pending` reduz o dano, mas o cliente pode ver erro apos “ter conseguido” o ingresso na UI se o front nao sincronizar com WebSocket.

Impacto: experiencia ruim; menos grave que confirmar pagamento em pedido invalido, desde que o guard e o webhook permanecam consistentes.

---

## Relacao entre fila, WebSocket e pagamento

| Camada                            | Funcao na concorrencia                                                   |
| --------------------------------- | ------------------------------------------------------------------------ |
| WebSocket                         | Canal em tempo real; nao deve executar reserva pesada inline.            |
| Fila `RETRIEVE_AVAILABLE_TICKETS` | Enfileira trabalho; worker executa reserva e devolve resultado ao canal. |
| HTTP pagamento                    | Caminho separado; assume que `Order` ja existe e esta `PENDING`.         |
| Webhook                           | Confirma ou altera estado financeiro de forma assincrona.                |

A fila concentra a **corrida mais critica para estoque** (quem ganha o ticket) em um pipeline assincrono observavel (logs de job, retry, falha). O fluxo de **pagamento** herda a qualidade dessa etapa: se a reserva falhar em silencio ou duplicar, o pagamento amplifica o erro com dinheiro real.

---

## Resumo: race condition → impacto em pagamentos

```text
Corrida na reserva          →  pedido invalido ou duplicado
                           →  PIX gerado para situacao inconsistente

Corrida na criacao de PIX   →  cobranca duplicada / reconciliacao

Corrida no webhook          →  order/payment dessincronizados
                           →  ticket USABLE errado (overselling / bloqueio)

Corrida expiracao x pago    →  cliente cobrado sem ingresso ou ingresso vendido 2x
```

**Pagamento e o ponto em que erro de concorrencia vira dinheiro.** Reserva incorreta e annoyance; pagamento incorreto e chargeback, estorno e processo judicial.

---

## Diretrizes para evolucao do sistema

1. **Tratar fila + lock de banco** como complementares, nao alternativas.
2. **Idempotencia** em criacao de pagamento e em todos os webhook handlers.
3. **Uma maquina de estados clara** (`order-status.md`) com transicoes validas rejeitadas em codigo.
4. **Processar por chave** (`order_id` / `ticket_id`) na mesma fila ou com lock distribuido quando escalar workers.
5. **Testes de concorrencia** (dois jobs simultaneos no mesmo `event_id`) antes de abrir venda de alto volume.

---

## Referencias no codigo

| Arquivo                                                                                           | Papel                                   |
| ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `src/shared/infra/socket/.../get-tickets-avaliability-and-maybe-create-order.service-adapter.ts`  | Publica job na fila                     |
| `src/modules/events/infra/queue/retrieve-available-tickets.worker.ts`                             | Consome fila e notifica WebSocket       |
| `src/modules/events/services/tickets/find-tickets-avaliability-and-maybe-create-order.service.ts` | Reserva ticket + cria pedido            |
| `src/modules/payments/services/create-payment.service.ts`                                         | Cria pagamento PIX para pedido pendente |
| `src/modules/payments/services/webhooks/abacatepay-completed.webhook-handler.ts`                  | Confirma pagamento e pedido             |
| `src/config/bullmq.config.ts`                                                                     | Tentativas e backoff da fila            |
| `docs/business rule/order-status.md`                                                              | Estados de Order, Payment e Ticket      |
