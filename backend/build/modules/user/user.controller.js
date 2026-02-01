"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
exports.userController = {
    async create(req, res) {
        try {
            const user = await user_service_1.userService.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async update(req, res) {
        try {
            const user = await user_service_1.userService.updateUser(Number(req.params.id), req.body);
            res.json({ success: true, data: user });
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async deactivate(req, res) {
        await user_service_1.userService.deactivateUser(Number(req.params.id));
        res.json({ success: true, message: 'User deactivated successfully' });
    },
    async hardDelete(req, res) {
        await user_service_1.userService.hardDeleteUser(Number(req.params.id));
        res.json({ success: true, message: 'User deleted permanently' });
    },
    async list(_, res) {
        const users = await user_service_1.userService.getUsers();
        res.json(users);
    },
    async getById(req, res) {
        try {
            const user = await user_service_1.userService.getUserById(Number(req.params.id));
            res.json({ success: true, data: user });
        }
        catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    },
};
