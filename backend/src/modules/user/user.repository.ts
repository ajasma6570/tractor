import { prisma } from '@/config/prisma';
import { CreateUserInput, UpdateUserInput } from './user.types';

export const userRepository = {
  create(data: CreateUserInput) {
    return prisma.user.create({ data });
  },

  update(id: number, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  softDelete(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  },

  hardDelete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  },

  findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },
};
