"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const env_1 = __importDefault(require("../config/env"));
const winston_1 = __importDefault(require("../lib/winston"));
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
exports.prisma = new client_1.PrismaClient({
    adapter,
});
const connectToDatabase = async () => {
    if (!env_1.default.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in the configuration.');
    }
    try {
        await exports.prisma.$connect();
        winston_1.default.info('Connected to the database successfully.', {
            uri: env_1.default.DATABASE_URL,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        winston_1.default.error('Error connecting to the database', err);
    }
};
exports.connectToDatabase = connectToDatabase;
const disconnectFromDatabase = async () => {
    try {
        await exports.prisma.$disconnect();
        winston_1.default.info('Disconnected from the database successfully.');
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        winston_1.default.error('Error disconnecting from the database', err);
    }
};
exports.disconnectFromDatabase = disconnectFromDatabase;
