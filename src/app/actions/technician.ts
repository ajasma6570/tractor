'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type CreateTechnicianInput = {
    name: string;
    phone: string;
    branch: string;
    isActive?: boolean;
};

export type UpdateTechnicianInput = {
    name?: string;
    phone?: string;
    branch?: string;
    isActive?: boolean;
};

export async function createTechnician(data: CreateTechnicianInput) {
    try {
        const technician = await prisma.technician.create({
            data: {
                name: data.name,
                phone: data.phone,
                branch: data.branch,
                isActive: data.isActive ?? true,
            },
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'Technician created successfully',
            data: technician
        };
    } catch (error) {
        console.error('Error creating technician:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create technician'
        };
    }
}

export async function updateTechnician(id: number, data: UpdateTechnicianInput) {
    try {
        const technician = await prisma.technician.update({
            where: { id },
            data,
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'Technician updated successfully',
            data: technician
        };
    } catch (error) {
        console.error('Error updating technician:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update technician'
        };
    }
}

export async function deleteTechnician(id: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return {
                success: false,
                message: 'Unauthorized. Admin role required.'
            };
        }

        await prisma.technician.update({
            where: { id },
            data: { isActive: false },
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'Technician deactivated successfully'
        };
    } catch (error) {
        console.error('Error deleting technician:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to deactivate technician'
        };
    }
}

export async function hardDeleteTechnician(id: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return {
                success: false,
                message: 'Unauthorized. Admin role required.'
            };
        }

        await prisma.technician.delete({
            where: { id },
        });

        revalidatePath('/user-management');
        return {
            success: true,
            message: 'Technician deleted permanently'
        };
    } catch (error) {
        console.error('Error hard deleting technician:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete technician'
        };
    }
}


export async function getTechnicians() {
    try {
        const technicians = await prisma.technician.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return technicians;
    } catch (error) {
        console.error('Error fetching technicians:', error);
        return [];
    }
}

export async function getTechnicianById(id: number) {
    try {
        const technician = await prisma.technician.findUnique({
            where: { id },
        });

        if (!technician) {
            return {
                success: false,
                message: 'Technician not found',
                data: null
            };
        }

        return {
            success: true,
            data: technician
        };
    } catch (error) {
        console.error('Error fetching technician:', error);
        return {
            success: false,
            message: 'Failed to fetch technician',
            data: null
        };
    }
}
