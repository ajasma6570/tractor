import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import config from '@/config/env';

const { combine, timestamp, printf, colorize, errors } = format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logDir = 'logs';
const appLogDir = path.join(logDir, 'app');
const errorLogDir = path.join(logDir, 'error');

// ✅ Create directories ONCE (not per import)
const ensureLogDirs = () => {
  [logDir, appLogDir, errorLogDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
};
ensureLogDirs();

const logFormat = printf(({ level, message, timestamp, stack }) => {
  // ✅ Include stack traces for errors
  return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
});

const logger = createLogger({
  levels: logLevels,
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // ✅ Auto-stack traces
    colorize({ all: true }),
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        format.simple(), // ✅ Console: human-readable
      ),
    }),
    new DailyRotateFile({
      filename: path.join(appLogDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
    new DailyRotateFile({
      filename: path.join(errorLogDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
  ],
});

export default logger;
