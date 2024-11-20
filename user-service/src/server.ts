import Hapi, { Server } from "@hapi/hapi";
import authRoutes from './routes/authRoutes';

export let server: Server;

export const initServer = async (): Promise<Server> => {
  server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    routes: {
      cors: true
    }
  });
  server.route(authRoutes);

  return server;
}

export const startServer = async (): Promise<void> => {
  console.log(`Listening on ${server.info.host}:${server.info.port}`)
  return server.start();
}