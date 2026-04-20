import express from 'express';
import '../../containers';
import globalErrorHandlerMiddleware from './middlewares/global-error-handler.middleware';
import dataSource from '../orm/database';
import routes from './routes';
import { errors } from 'celebrate';

async function main() {
  const port = process.env.PORT;

  const app = express();

  app.use(express.json());
  app.use(routes);
  app.use(errors());
  app.use(globalErrorHandlerMiddleware);

  await dataSource.initialize();

  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

main();
