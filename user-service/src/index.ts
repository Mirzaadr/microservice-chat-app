import { initServer, startServer } from './server';

process.on('unhandledRejection', (err) => {
  console.error("unhandledRejection");
  console.error(err);
  process.exit(1);
});

initServer().then(() => startServer());