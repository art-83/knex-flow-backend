import { hash } from 'bcryptjs';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { v7 as uuidv7 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'arthurfmedeiros77@gmail.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Arthur098.';
const ORG_NAME = process.env.SEED_ORG_NAME ?? 'KnexTech Corp';

const PERMISSIONS = [
  'events:read',
  'events:manage',
  'activities:read',
  'activities:manage',
  'batches:read',
  'batches:manage',
  'team:read',
  'team:manage',
];

const client = new pg.Client({
  host: process.env.SEED_DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? process.env.POSTGRES_USER,
  password: process.env.DB_PASSWORD ?? process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME ?? process.env.POSTGRES_DB,
});

async function main() {
  await client.connect();

  const hashedPassword = await hash(ADMIN_PASSWORD, 10);

  const existingUser = await client.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [ADMIN_EMAIL]);

  let userId;

  if (existingUser.rowCount > 0) {
    userId = existingUser.rows[0].id;
    await client.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, userId]);
    console.log(`Admin atualizado: ${ADMIN_EMAIL}`);
  } else {
    userId = uuidv7();
    await client.query(
      `INSERT INTO users (id, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [userId, ADMIN_EMAIL, hashedPassword],
    );
    console.log(`Admin criado: ${ADMIN_EMAIL}`);
  }

  const existingOrg = await client.query(
    `SELECT o.id
     FROM organizations o
     INNER JOIN user_organizations uo ON uo.organization_id = o.id
     WHERE uo.user_id = $1
     LIMIT 1`,
    [userId],
  );

  let organizationId;

  if (existingOrg.rowCount > 0) {
    organizationId = existingOrg.rows[0].id;
  } else {
    organizationId = uuidv7();
    await client.query(
      `INSERT INTO organizations (id, name, configuration, created_at, updated_at)
       VALUES ($1, $2, NULL, NOW(), NOW())`,
      [organizationId, ORG_NAME],
    );

    await client.query(
      `INSERT INTO user_organizations (id, user_id, organization_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [uuidv7(), userId, organizationId],
    );
    console.log(`Organizacao vinculada: ${ORG_NAME}`);
  }

  for (const description of PERMISSIONS) {
    const permission = await client.query(
      'SELECT id FROM permissions WHERE description = $1 AND deleted_at IS NULL LIMIT 1',
      [description],
    );

    if (permission.rowCount === 0) {
      console.warn(`Permissao nao encontrada: ${description} (rode o servidor para sincronizar)`);
      continue;
    }

    const permissionId = permission.rows[0].id;
    const existingGrant = await client.query(
      `SELECT id FROM user_permissions
       WHERE user_id = $1 AND organization_id = $2 AND permission_id = $3 AND deleted_at IS NULL
       LIMIT 1`,
      [userId, organizationId, permissionId],
    );

    if (existingGrant.rowCount === 0) {
      await client.query(
        `INSERT INTO user_permissions (id, user_id, organization_id, permission_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [uuidv7(), userId, organizationId, permissionId],
      );
    }
  }

  console.log('Seed local admin concluido.');
}

main()
  .catch(error => {
    console.error('Falha no seed local admin:', error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
