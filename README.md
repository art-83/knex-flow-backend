# knex-flow-backend

## Rodando o projeto com Docker

### Pré-requisitos

- Docker e Docker Compose instalados.
- Arquivo `.env` configurado (copie de `.env.example`).

### Passo a passo

1. Instale as dependências:

```bash
npm install
```

1. Gere o build do projeto:

```bash
npm run build
```

1. Suba os containers com Docker Compose:

```bash
docker compose up --build
```

Esse comando sobe:

- `app`: API HTTP
- `workers`: processamento de filas (BullMQ)
- `db`: PostgreSQL
- `redis`: filas

### Observações importantes

- Todas as variáveis de ambiente ficam em um único `.env`.
