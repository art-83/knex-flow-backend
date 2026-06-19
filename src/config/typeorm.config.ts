import fs from 'fs';

import { appEntities } from '../shared/infra/orm/entities/app-entities';

const entities = process.env.ENVIRONMENT === 'test' ? appEntities : [__dirname + String(process.env.ORM_ENTITIES_PATH)];

const typeOrmConfig = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_NAME),
  entities,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  ...(process.env.ENVIRONMENT === 'production'
    ? {
        ssl: {
          ca: fs.readFileSync(__dirname + String(process.env.SSL_CERT_PATH)),
        },
      }
    : {}),
  extra: {
    max: Number(process.env.DB_POOL_MAX),
    idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS),
    options: `-c timezone=${String(process.env.DB_TIMEZONE)}`,
  },
};
export { typeOrmConfig };
