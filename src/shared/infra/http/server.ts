import express from 'express';
import dataSource from '../orm/database';
import routes from './routes';

async function main() {
  const port = process.env.PORT;

  const app = express();

  app.use(express.json());
  
  app.use(routes);

  await dataSource.initialize();

  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

main();
