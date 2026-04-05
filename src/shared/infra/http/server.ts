import express from 'express';
import dataSource from '../orm/database';

async function main() {
  const port = process.env.PORT;

  const app = express();

  app.use(express.json());

  await dataSource.initialize();

  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

main();
