import express from 'express';
import config from './config/env';
import compression from 'compression';
import helmet from 'helmet';
import { connectToDatabase, disconnectFromDatabase } from '@/config/prisma';
import logger from '@/lib/winston';
import v1Routes from './routes/v1';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression({ threshold: 1024 }));
app.use(helmet());

let server: any;
const startServer = async () => {
  try {
    await connectToDatabase();

    app.get('/ping', async (req, res) => {
      res.json({ status: 'success', message: 'pong' });
    });

    app.use('/api/v1', v1Routes);

    server = app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err });

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await disconnectFromDatabase();
      logger.info('Server closed. Exiting process.');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer().catch((err) => {
  logger.error('Uncaught startup error:', err);
  process.exit(1);
});
