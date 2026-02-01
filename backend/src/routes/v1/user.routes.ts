import { Router } from 'express';
import { userController } from '@/modules/user/user.controller';
// import { authMiddleware } from "@/middlewares/auth.middleware";
// import { allowRoles } from "@/middlewares/rbac.middleware";

const router = Router();

/* ADMIN ONLY */
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.deactivate);
router.delete('/hard/:id', userController.hardDelete);

export default router;
