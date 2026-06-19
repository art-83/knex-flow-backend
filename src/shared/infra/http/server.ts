import '../../containers';
import { createApp } from './create-app';
import { webConnectionConfig } from '../../../config/web-connection.config';

async function main() {
  const port = webConnectionConfig.http.port;
  const { shutdown } = await createApp({
    port,
    enableWorkers: true,
    enableWebSocket: true,
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received');
    console.log('Shutting down resources...');
    await shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    console.log('Shutting down resources...');
    await shutdown();
    process.exit(0);
  });

  console.log(`http://localhost:${port}`);
}

main();
