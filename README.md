# eventflow-new-backend

## Rodando o projeto com Docker

### Pré-requisitos

- Docker e Docker Compose instalados.
- Arquivo `.env` configurado (copie de `.env.example`).
- Certificado SSL em `src/config/prod-ca-2021.crt` (necessário apenas com `ENVIRONMENT=production`).

### Passo a passo

1. Instale as dependências:

```bash
npm install
```

2. Gere o build do projeto:

```bash
npm run build
```

3. Suba os containers com Docker Compose:

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
- Sem o certificado SSL (`src/config/prod-ca-2021.crt`), conexões com banco gerenciado em produção podem falhar.
