import fs from 'fs';

const typeOrmConfig = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + String(process.env.ORM_ENTITIES_PATH)],
  ssl: {
    ca: fs.readFileSync(__dirname + String(process.env.SSL_CERT_PATH)),
  },
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
  }
};

export default typeOrmConfig;
