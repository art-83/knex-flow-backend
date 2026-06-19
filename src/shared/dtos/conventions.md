# DTO conventions

All boundary contracts live under `dtos/` with three buckets:

- `incoming/` — payloads entering the application (HTTP body/query, webhooks, gateway responses)
- `outgoing/` — payloads leaving the application (HTTP responses, gateway requests)
- `internal/` — intra-application contracts (repositories, queues, domain value objects)

## Subfolders

```
incoming/http/          # client requests
incoming/webhooks/      # provider webhooks
incoming/gateways/      # external API responses we consume
outgoing/http/          # API responses to clients
outgoing/gateways/      # requests sent to external APIs
internal/repositories/  # repository command/result shapes
internal/queue/         # BullMQ job payloads
internal/domain/        # shared domain value objects
internal/storage/       # storage provider contracts
```

## Naming

- Interface suffix: `DTO` (e.g. `LoginRequestDTO`, `LoginResponseDTO`)
- File suffix: `.dto.ts` (kebab-case)
- Joi validation: `.schema.ts` next to the related incoming HTTP DTO

## Rules

- Do not use a parallel `types/` folder
- Prefer explicit fields over `extends Entity` for HTTP DTOs (refactor gradually)
- Controllers delegate typing to services via incoming/outgoing DTOs
