import bcrypt from 'bcrypt';
import { userRepository } from './user.repository';
import { CreateUserInput, UpdateUserInput } from './user.types';

export const userService = {
  async createUser(data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userRepository.create({
      ...data,
      password: hashedPassword,
      isActive: data.isActive ?? true,
    });
  },

  async updateUser(id: number, data: UpdateUserInput) {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updateData.password;
    }

    return userRepository.update(id, updateData);
  },

  async deactivateUser(id: number) {
    return userRepository.softDelete(id);
  },

  async hardDeleteUser(id: number) {
    return userRepository.hardDelete(id);
  },

  async getUsers() {
    return userRepository.findAll();
  },

  async getUserById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};
