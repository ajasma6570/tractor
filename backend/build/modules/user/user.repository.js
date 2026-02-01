"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.userRepository = {
    create(data) {
        return prisma_1.prisma.user.create({ data });
    },
    update(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
        });
    },
    softDelete(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    },
    hardDelete(id) {
        return prisma_1.prisma.user.delete({
            where: { id },
        });
    },
    findAll() {
        return prisma_1.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },
    findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
        });
    },
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
        });
    },
    findByUsername(username) {
        return prisma_1.prisma.user.findUnique({
            where: { username },
        });
    },
};
