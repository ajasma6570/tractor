"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("./config/env"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const prisma_1 = require("./config/prisma");
const winston_1 = __importDefault(require("./lib/winston"));
const v1_1 = __importDefault(require("./routes/v1"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, compression_1.default)({ threshold: 1024 }));
app.use((0, helmet_1.default)());
let server;
const startServer = async () => {
    try {
        await (0, prisma_1.connectToDatabase)();
        app.get('/ping', async (req, res) => {
            res.json({ status: 'success', message: 'pong' });
        });
        app.use('/api/v1', v1_1.default);
        server = app.listen(env_1.default.PORT, () => {
            winston_1.default.info(`Server running: http://localhost:${env_1.default.PORT}`);
        });
    }
    catch (err) {
        winston_1.default.error('Failed to start server', { error: err });
        if (env_1.default.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
const gracefulShutdown = async (signal) => {
    winston_1.default.info(`${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(async () => {
            await (0, prisma_1.disconnectFromDatabase)();
            winston_1.default.info('Server closed. Exiting process.');
            process.exit(0);
        });
    }
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
startServer().catch((err) => {
    winston_1.default.error('Uncaught startup error:', err);
    process.exit(1);
});
