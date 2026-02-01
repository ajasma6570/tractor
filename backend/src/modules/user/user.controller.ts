import { Request, Response } from 'express';
import { userService } from './user.service';

export const userController = {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(
        Number(req.params.id),
        req.body,
      );
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async deactivate(req: Request, res: Response) {
    await userService.deactivateUser(Number(req.params.id));
    res.json({ success: true, message: 'User deactivated successfully' });
  },

  async hardDelete(req: Request, res: Response) {
    await userService.hardDeleteUser(Number(req.params.id));
    res.json({ success: true, message: 'User deleted permanently' });
  },

  async list(_: Request, res: Response) {
    const users = await userService.getUsers();
    res.json(users);
  },

  async getById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  },
};
