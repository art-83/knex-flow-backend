# Inventário de API

Rotas expostas em `src/shared/infra/http/routes/index.ts`.  
Rotas abaixo de **Autenticadas** exigem header `Authorization: Bearer <access_token>`.

---

## Públicas (sem JWT)

### Health

| Método | Rota      | Descrição                  |
| ------ | --------- | -------------------------- |
| GET    | `/health` | Health check com timestamp |

### Autenticação — `/auth`

| Método | Rota             | Body                  | Descrição           |
| ------ | ---------------- | --------------------- | ------------------- |
| POST   | `/auth/register` | `{ email, password }` | Cadastro + tokens   |
| POST   | `/auth/login`    | `{ email, password }` | Login + tokens      |
| POST   | `/auth/refresh`  | `{ refreshToken }`    | Renova access token |

### Eventos públicos — `/events`

| Método | Rota      | Query                                         | Descrição                                                                  |
| ------ | --------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| GET    | `/events` | `organization_id` (obrig.), filtros opcionais | Lista eventos com atividades, convidados e contagem de tickets disponíveis |

### Webhooks — `/webhook`

| Método | Rota                  | Descrição                                                |
| ------ | --------------------- | -------------------------------------------------------- |
| POST   | `/webhook/abacatepay` | Webhook AbacatePay (header validado). Roteia por `event` |

---

## Autenticadas

### Usuário — `/users`

| Método | Rota        | Descrição                                        |
| ------ | ----------- | ------------------------------------------------ |
| GET    | `/users/me` | Perfil, `user_permissions`, `user_organizations` |

### Permissões de usuário — `/users/user-permissions`

| Método | Rota                          | Descrição                             |
| ------ | ----------------------------- | ------------------------------------- |
| POST   | `/users/user-permissions`     | Atribui permissão a usuário na org    |
| GET    | `/users/user-permissions`     | Lista (`organization_id` obrigatório) |
| DELETE | `/users/user-permissions/:id` | Remove (`organization_id` na query)   |

### Papéis — `/users/organization-roles`

| Método | Rota                            | Descrição         |
| ------ | ------------------------------- | ----------------- |
| POST   | `/users/organization-roles`     | Cria papel na org |
| GET    | `/users/organization-roles`     | Lista             |
| PATCH  | `/users/organization-roles/:id` | Atualiza          |
| DELETE | `/users/organization-roles/:id` | Remove            |

### Permissões de papel — `/users/organization-role-permissions`

| Método | Rota                                       | Descrição                  |
| ------ | ------------------------------------------ | -------------------------- |
| POST   | `/users/organization-role-permissions`     | Vincula permissão ao papel |
| GET    | `/users/organization-role-permissions`     | Lista                      |
| DELETE | `/users/organization-role-permissions/:id` | Remove                     |

### Atividades (catálogo) — `/organizations`

| Método | Rota                                         | Descrição                        |
| ------ | -------------------------------------------- | -------------------------------- |
| GET    | `/organizations/activities`                  | Lista (`organization_id` obrig.) |
| POST   | `/organizations/:organization_id/activities` | Cria atividade no catálogo       |
| PATCH  | `/organizations/activities/:activity_id`     | Atualiza                         |
| DELETE | `/organizations/activities/:activity_id`     | Remove                           |

> **Ausente:** CRUD de `organizations` e membership (`user_organizations`).

### Eventos (gestão) — `/events`

| Método | Rota                                          | Descrição                                 |
| ------ | --------------------------------------------- | ----------------------------------------- |
| POST   | `/events`                                     | Cria evento (+ endereço opcional)         |
| PATCH  | `/events/:event_id`                           | Atualiza evento                           |
| DELETE | `/events/:event_id`                           | Soft delete                               |
| POST   | `/events/:event_id/activity`                  | Cria `event_activity` + slots de presença |
| GET    | `/events/event-activities`                    | Lista (`event_id` obrig.)                 |
| PATCH  | `/events/event-activities/:event_activity_id` | Atualiza programação                      |
| DELETE | `/events/event-activities/:event_activity_id` | Remove                                    |
| GET    | `/events/event-configurations`                | Lê `configuration` do evento              |
| PATCH  | `/events/:event_id/configuration`             | Atualiza `configuration` (jsonb)          |
| DELETE | `/events/:event_id/configuration`             | Limpa configuração                        |

### Lotes — `/events/batches`

| Método | Rota                        | Descrição                  |
| ------ | --------------------------- | -------------------------- |
| POST   | `/events/batches`           | Cria lote + gera N tickets |
| GET    | `/events/batches`           | Lista (`event_id` obrig.)  |
| PATCH  | `/events/batches/:batch_id` | Atualiza lote              |
| DELETE | `/events/batches/:batch_id` | Remove                     |

### Pedidos — `/orders`

| Método | Rota      | Descrição                                                |
| ------ | --------- | -------------------------------------------------------- |
| GET    | `/orders` | Lista pedidos do usuário autenticado (filtros opcionais) |

> **Ausente:** cancelar pedido, detalhe por id, endpoint admin.

### Pagamentos — `/payment` e `/payments`

| Método | Rota            | Descrição                          |
| ------ | --------------- | ---------------------------------- |
| POST   | `/payments`     | Cria pagamento PIX para `order_id` |
| GET    | `/payments/:id` | Busca pagamento do usuário         |

Body do POST: `{ order_id, method: 'PIX' | 'CREDIT' | 'DEBIT' }` — apenas **PIX** tem gateway implementado.

### Arquivos — `/files`

| Método | Rota     | Descrição                                             |
| ------ | -------- | ----------------------------------------------------- |
| POST   | `/files` | Upload `multipart/form-data` campo `file` (max 10 MB) |

---

## WebSocket (Socket.IO)

Mesma origem/porta do HTTP. Autenticação via `handshake.auth.token = "Bearer <access_token>"`.

### Conexão

| Parâmetro    | Onde              | Obrigatório                          |
| ------------ | ----------------- | ------------------------------------ |
| `channel_id` | `handshake.query` | Sim — identifica o canal de resposta |
| `token`      | `handshake.auth`  | Sim — JWT Bearer                     |

### Mensagens suportadas

| `type`                       | Payload esperado                                    | Comportamento                                                                                                    |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `retrieve-available-tickets` | `{ event_id }` (+ `user_id` injetado pelo servidor) | Enfileira job BullMQ; worker reserva ticket e cria `Order PENDING`; responde no evento `message` e fecha conexão |

### Resposta (sucesso)

```json
{
  "channel_id": "...",
  "type": "retrieve-available-tickets",
  "payload": {
    "data": {
      "message": "Tickets available! Order created successfully.",
      "data": {
        "ticket": { "...": "..." },
        "ticketAvailability": "RESERVED"
      }
    }
  }
}
```

### Fluxo completo pós-WebSocket

1. `POST /payments` com `order_id` retornado
2. Exibir QR Code (`gatewayPayment.brCode` / `brCodeBase64`)
3. Aguardar webhook ou simulação em dev
4. `GET /orders` ou `GET /payments/:id` para confirmar status

---

## Serviços sem exposição HTTP

Existem no código mas **não têm rota**:

| Service                     | Arquivo                                           |
| --------------------------- | ------------------------------------------------- |
| `CreateEventInvitedService` | `services/events/create-event-invited.service.ts` |

---

## Matriz: feature → endpoint

| Feature                 | Endpoint                        | Status |
| ----------------------- | ------------------------------- | ------ |
| Cadastro/login          | `/auth/*`                       | ✅     |
| Ver meu perfil          | `GET /users/me`                 | ✅     |
| Gerenciar permissões    | `/users/user-permissions`       | ✅     |
| Gerenciar papéis        | `/users/organization-roles`     | ✅     |
| Criar organização       | —                               | ❌     |
| Entrar na organização   | —                               | ❌     |
| Catálogo de atividades  | `/organizations/.../activities` | ✅     |
| CRUD eventos            | `/events`                       | ✅     |
| Vender ingressos        | WebSocket + `/payments`         | ⚠️     |
| Listar meus pedidos     | `GET /orders`                   | ✅     |
| Convidados de atividade | —                               | ❌     |
| Check-in / presença     | —                               | ❌     |
| Upload de mídia         | `POST /files`                   | ✅     |
