"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("./user.repository");
exports.userService = {
    async createUser(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return user_repository_1.userRepository.create({
            ...data,
            password: hashedPassword,
            isActive: data.isActive ?? true,
        });
    },
    async updateUser(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
        else {
            delete updateData.password;
        }
        return user_repository_1.userRepository.update(id, updateData);
    },
    async deactivateUser(id) {
        return user_repository_1.userRepository.softDelete(id);
    },
    async hardDeleteUser(id) {
        return user_repository_1.userRepository.hardDelete(id);
    },
    async getUsers() {
        return user_repository_1.userRepository.findAll();
    },
    async getUserById(id) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
};
