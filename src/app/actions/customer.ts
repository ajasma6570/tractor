'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                phone,
            },
        });

        revalidatePath('/customers'); // Refresh the page data
        return { success: true, message: 'Customer added successfully' };
    } catch {
        return { success: false, message: 'Failed to add customer' };
    }
}


export async function getCustomers() {
    return prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
}