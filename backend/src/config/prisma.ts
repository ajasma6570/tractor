import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import config from '@/config/env';
import logger from '@/lib/winston';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

export const connectToDatabase = async (): Promise<void> => {
  if (!config.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the configuration.');
  }

  try {
    await prisma.$connect();

    logger.info('Connected to the database successfully.', {
      uri: config.DATABASE_URL,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error('Error connecting to the database', err);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();

    logger.info('Disconnected from the database successfully.');
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error('Error disconnecting from the database', err);
  }
};
