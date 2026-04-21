---
name: abacatepay
description: Integra a API da AbacatePay para cobrancas, checkout hospedado, checkout transparente PIX, assinaturas, webhooks, payouts e transferencias PIX. Use quando o usuario mencionar AbacatePay, pagamentos, PIX, checkout, assinatura recorrente, webhook de pagamento, saque, payout, cupom, cliente ou produto.
---

# AbacatePay

## Quando usar

Use esta skill quando o usuario pedir para:

- integrar pagamentos com AbacatePay;
- criar fluxos de checkout, link de pagamento ou checkout transparente (PIX QR Code);
- configurar produtos, clientes, cupons, assinaturas e webhooks;
- implementar saques (payouts) ou transferencias PIX.

## Regras obrigatorias da API

1. Base URL: `https://api.abacatepay.com/v2`
2. Autenticacao: enviar `Authorization: Bearer <API_KEY>` em todas as rotas privadas.
3. Content type: `application/json`.
4. Valores monetarios sempre em centavos (`10000` = R$ 100,00).
5. Tratar respostas no envelope:
   - sucesso: `{ "data": {...}, "success": true, "error": null }`
   - erro: `success: false` e/ou `error` preenchido
6. Moeda operacional: BRL.

## Ordem recomendada de implementacao

1. Configurar cliente HTTP base (timeout, headers, tratamento de envelope).
2. Criar modulo de produtos (`externalId` do catalogo interno).
3. Criar modulo de clientes (unicidade por CPF/CNPJ via `taxId`).
4. Implementar cobranca:
   - checkout hospedado (`/checkouts/create`) ou
   - checkout transparente PIX (`/transparents/create`).
5. Adicionar webhooks para confirmacao assicrona de status.
6. Se necessario, adicionar assinaturas, cupons, payouts e transferencias PIX.

## Regras de negocio que costumam quebrar integracao

- Produtos devem existir antes de criar checkout.
- `externalId` deve ser estavel para correlacao com catalogo local.
- Criar cliente com `taxId` ja existente retorna cliente existente (nao duplicar localmente).
- Assinatura exige produto com `cycle` definido:
  `WEEKLY`, `MONTHLY`, `SEMIANNUALLY`, `ANNUALLY`.
- Checkout transparente suporta PIX e retorna:
  - `brCode` (copia e cola)
  - `brCodeBase64` (PNG em base64)
- Webhook exige endpoint HTTPS publico e validacao HMAC com o `secret`.

## Fluxos padrao

### Checkout hospedado

1. Garantir produtos cadastrados.
2. Montar `items` com `id` do produto e `quantity`.
3. Criar checkout em `/checkouts/create`.
4. Redirecionar cliente para `data.url`.
5. Confirmar pagamento via webhook (`checkout.completed`) e reconciliar no backend.

### Checkout transparente (PIX embutido)

1. Chamar `/transparents/create` com `data.amount` em centavos.
2. Exibir `brCode` e/ou renderizar `brCodeBase64`.
3. Consultar status com `/transparents/check` e/ou receber webhook (`transparent.completed`).
4. Em sandbox/devMode, usar `/transparents/simulate-payment` para testes.

### Assinaturas recorrentes

1. Criar produto com `cycle` valido.
2. Criar assinatura via `/subscriptions/create` com exatamente 1 item.
3. Tratar eventos de webhook de assinatura:
   `subscription.completed`, `subscription.renewed`, `subscription.cancelled`.
4. Permitir cancelamento com `/subscriptions/cancel`.

## Validacao de webhook (padrao)

1. Ler corpo bruto (`raw body`) da requisicao.
2. Calcular HMAC com o `secret` configurado.
3. Comparar assinatura recebida no header da AbacatePay com comparacao de tempo constante.
4. So processar o evento quando a assinatura for valida.

## Qualidade minima ao implementar

- Centralizar chamadas HTTP em um client AbacatePay.
- Criar mapeadores para converter centavos <-> representacao monetaria interna.
- Registrar `externalId`/IDs da AbacatePay para reconciliacao.
- Cobrir com testes de:
  - parse do envelope de resposta;
  - criacao de checkout;
  - fluxo transparente PIX;
  - validacao de webhook HMAC;
  - regras de assinatura (produto com `cycle`).

## Recursos adicionais

- Mapa de endpoints e links oficiais: [reference.md](reference.md)
