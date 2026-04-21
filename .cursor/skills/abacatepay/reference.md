# AbacatePay API Reference

## Visao geral

- Base URL: `https://api.abacatepay.com/v2`
- Protocolo: REST + JSON
- Autenticacao: `Authorization: Bearer <sua-api-key>`
- Valores monetarios: centavos
- Envelope de resposta: `{ "data": {...}, "success": true, "error": null }`

## Regras importantes

- Produtos precisam existir antes de criar checkouts.
- `externalId` deve mapear para o catalogo interno.
- Clientes sao unicos por CPF/CNPJ (`taxId`).
- Assinaturas exigem produto com `cycle`:
  `WEEKLY`, `MONTHLY`, `SEMIANNUALLY`, `ANNUALLY`.
- Checkout transparente gera PIX imediato sem redirecionamento.
- Webhooks exigem URL HTTPS publica e validacao HMAC com `secret`.

## Checkout (hospedado)

- Referencia: [Checkout Reference](https://docs.abacatepay.com/pages/payment/reference)
- `POST /checkouts/create`: [Create Checkout](https://docs.abacatepay.com/pages/payment/create)
- `GET /checkouts/list`: [List Checkouts](https://docs.abacatepay.com/pages/payment/list)
- `GET /checkouts/one`: [Get Checkout](https://docs.abacatepay.com/pages/payment/one)

## Links de pagamento

- Referencia: [Payment Links Reference](https://docs.abacatepay.com/pages/payment-links/reference)
- `POST /payment-links/create`: [Create Payment Link](https://docs.abacatepay.com/pages/payment-links/create)
- `GET /payment-links/list`: [List Payment Links](https://docs.abacatepay.com/pages/payment-links/list)
- `GET /payment-links/one`: [Get Payment Link](https://docs.abacatepay.com/pages/payment-links/one)

## Clientes

- Referencia: [Customers Reference](https://docs.abacatepay.com/pages/client/reference)
- `POST /customers/create`: [Create Customer](https://docs.abacatepay.com/pages/client/create)
- `GET /customers/list`: [List Customers](https://docs.abacatepay.com/pages/client/list)
- `GET /customers/get`: [Get Customer](https://docs.abacatepay.com/pages/client/get)
- `POST /customers/delete`: [Delete Customer](https://docs.abacatepay.com/pages/client/delete)

## Checkout transparente (PIX embutido)

- Referencia: [Transparent Checkout Reference](https://docs.abacatepay.com/pages/pix-qrcode/reference)
- `POST /transparents/create`: [Create Transparent Checkout](https://docs.abacatepay.com/pages/pix-qrcode/create)
- `GET /transparents/list`: [List Transparent Checkouts](https://docs.abacatepay.com/pages/pix-qrcode/list)
- `POST /transparents/simulate-payment`: [Simulate Transparent Payment](https://docs.abacatepay.com/pages/pix-qrcode/simulate-payment)
- `GET /transparents/check`: [Check Transparent Payment](https://docs.abacatepay.com/pages/pix-qrcode/check)

## Produtos

- Referencia: [Products Reference](https://docs.abacatepay.com/pages/products/reference)
- `POST /products/create`: [Create Product](https://docs.abacatepay.com/pages/products/create)
- `GET /products/list`: [List Products](https://docs.abacatepay.com/pages/products/list)
- `GET /products/get`: [Get Product](https://docs.abacatepay.com/pages/products/get)
- `POST /products/delete`: [Delete Product](https://docs.abacatepay.com/pages/products/delete)

## Cupons

- Referencia: [Coupons Reference](https://docs.abacatepay.com/pages/coupons/reference)
- `POST /coupons/create`: [Create Coupon](https://docs.abacatepay.com/pages/coupons/create)
- `GET /coupons/list`: [List Coupons](https://docs.abacatepay.com/pages/coupons/list)
- `GET /coupons/get`: [Get Coupon](https://docs.abacatepay.com/pages/coupons/get)
- `POST /coupons/delete`: [Delete Coupon](https://docs.abacatepay.com/pages/coupons/delete)
- `POST /coupons/toggle`: [Toggle Coupon](https://docs.abacatepay.com/pages/coupons/toggle)

## Webhooks

- Referencia: [Webhooks Reference](https://docs.abacatepay.com/pages/webhooks/reference)
- `POST /webhooks/create`: [Create Webhook](https://docs.abacatepay.com/pages/webhooks/create)
- `GET /webhooks/list`: [List Webhooks](https://docs.abacatepay.com/pages/webhooks/list)
- `GET /webhooks/get`: [Get Webhook](https://docs.abacatepay.com/pages/webhooks/get)
- `POST /webhooks/delete`: [Delete Webhook](https://docs.abacatepay.com/pages/webhooks/delete)

Eventos:

- `checkout.completed`
- `checkout.refunded`
- `checkout.disputed`
- `checkout.lost`
- `transparent.completed`
- `transparent.refunded`
- `transparent.disputed`
- `transparent.lost`
- `subscription.completed`
- `subscription.cancelled`
- `subscription.renewed`
- `subscription.trial_started`
- `payout.completed`
- `payout.failed`
- `transfer.completed`
- `transfer.failed`

## Assinaturas

- Referencia: [Subscriptions Reference](https://docs.abacatepay.com/pages/subscriptions/reference)
- `POST /subscriptions/create`: [Create Subscription Checkout](https://docs.abacatepay.com/pages/subscriptions/create)
- `GET /subscriptions/list`: [List Subscriptions](https://docs.abacatepay.com/pages/subscriptions/list)
- `POST /subscriptions/cancel`: [Cancel Subscription](https://docs.abacatepay.com/pages/subscriptions/cancel)

## Saques (payouts)

- Referencia: [Payouts Reference](https://docs.abacatepay.com/pages/payouts/reference)
- `POST /payouts/create`: [Create Payout](https://docs.abacatepay.com/pages/payouts/create)
- `GET /payouts/get`: [Get Payout](https://docs.abacatepay.com/pages/payouts/get)
- `GET /payouts/list`: [List Payouts](https://docs.abacatepay.com/pages/payouts/list)

Regras:

- Minimo: R$ 3,50
- Taxa: R$ 0,80 por saque
- Limite: 1 saque/minuto

## Transferencias PIX (envio para terceiros)

- Referencia: [PIX Reference](https://docs.abacatepay.com/pages/pix/reference)
- `POST /pix/create`: [Create PIX Transfer](https://docs.abacatepay.com/pages/pix/create)
- `GET /pix/get`: [Get PIX Transfer](https://docs.abacatepay.com/pages/pix/get)
- `GET /pix/list`: [List PIX Transfers](https://docs.abacatepay.com/pages/pix/list)

## Loja

- Referencia: [Store Reference](https://docs.abacatepay.com/pages/store/reference)
- `GET /store/get`: [Get Store](https://docs.abacatepay.com/pages/store/get)

## Opcional (publico, sem autenticacao)

- Referencia: [TrustMRR Reference](https://docs.abacatepay.com/pages/trustMRR/reference)
- `GET /trustMRR/mrr`: [Get Public MRR](https://docs.abacatepay.com/pages/trustMRR/mrr)
- `GET /trustMRR/get`: [Get Public Merchant](https://docs.abacatepay.com/pages/trustMRR/get)
- `GET /trustMRR/list`: [List Public Revenue History](https://docs.abacatepay.com/pages/trustMRR/list)
