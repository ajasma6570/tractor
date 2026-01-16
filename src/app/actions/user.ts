'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

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

export async function createUser(data: CreateUserInput) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword,
                phone: data.phone || null,
                role: data.role,
                isActive: data.isActive ?? true,
            },
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'User created successfully',
            data: user
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create user'
        };
    }
}

export async function updateUser(id: number, data: UpdateUserInput) {
    try {
        const updateData: any = {
            ...data,
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        } else {
            delete updateData.password;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'User updated successfully',
            data: user
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update user'
        };
    }
}

export async function deleteUser(id: number) {
    try {
        await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'User deactivated successfully'
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to deactivate user'
        };
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getUserById(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return {
                success: false,
                message: 'User not found',
                data: null
            };
        }

        return {
            success: true,
            data: user
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return {
            success: false,
            message: 'Failed to fetch user',
            data: null
        };
    }
}
