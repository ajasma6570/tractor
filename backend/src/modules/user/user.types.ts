import { UserRole } from '@prisma/client';

export type CreateUserInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
};

export type UpdateUserInput = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
};
