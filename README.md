# eventflow-new-backend

## Rodando o projeto com Docker

### Pré-requisitos

- Docker e Docker Compose instalados.
- Arquivos de ambiente configurados:
  - `.env`
  - `.env.development`
- Certificado SSL disponível em `src/config/prod-ca-2021.crt`.

### Passo a passo

1. Instale as dependências:

```bash
npm install
```

2. Gere o build do projeto:

```bash
npm run build
```

3. Suba os containers com Docker Compose (ambiente de desenvolvimento):

```bash
docker compose -f docker-compose.development.yml up --build
```

Esse comando sobe:

- `app`: API HTTP
- `worker`: processamento de filas (BullMQ)
- `db`: PostgreSQL local

### Observações importantes

- O projeto depende dos valores definidos em `.env` e `.env.development`.
- Sem o certificado SSL (`src/config/prod-ca-2021.crt`), a conexão segura com o banco/serviços externos pode falhar.
