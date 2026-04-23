import '../../containers';
import express from 'express';
import { errors } from 'celebrate';
import { container } from 'tsyringe';
import dataSource from '../orm/database';
import RedisConnection from '../queue/redis-connection';
import { IProducerProvider } from '../queue/infra/providers/producer.provider';
import routes from './routes';

async function main() {
  const port = process.env.PORT;
  const producerProvider = container.resolve<IProducerProvider>('ProducerProvider');

  const app = express();

  app.use(express.json());
  app.use(routes);
  app.use(errors());

  await dataSource.initialize();

  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });

  const shutdownResources = async (): Promise<void> => {
    await producerProvider.close();

    if (RedisConnection.hasInstance()) {
      await RedisConnection.getInstance().close();
    }

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  };

  process.on('SIGINT', async () => {
    console.log('SIGINT received');
    await shutdownResources();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    await shutdownResources();
    process.exit(0);
  });
}

main();
