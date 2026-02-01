"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("../config/env"));
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const logDir = 'logs';
const appLogDir = path_1.default.join(logDir, 'app');
const errorLogDir = path_1.default.join(logDir, 'error');
const ensureLogDirs = () => {
    [logDir, appLogDir, errorLogDir].forEach((dir) => {
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
    });
};
ensureLogDirs();
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
});
const logger = (0, winston_1.createLogger)({
    levels: logLevels,
    level: env_1.default.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), colorize({ all: true }), logFormat),
    transports: [
        new winston_1.transports.Console({
            format: combine(colorize({ all: true }), winston_1.format.simple()),
        }),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(appLogDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
        }),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(errorLogDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
    ],
});
exports.default = logger;
