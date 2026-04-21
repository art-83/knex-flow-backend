import fs from 'fs';

const typeOrmConfig = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_NAME),
  entities: [__dirname + String(process.env.ORM_ENTITIES_PATH)],
  synchronize: true,
  ...(process.env.ENVIRONMENT === 'production'
    ? {
        ssl: {
          ca: fs.readFileSync(__dirname + String(process.env.SSL_CERT_PATH)),
        },
      }
    : {}),
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

export default typeOrmConfig;
