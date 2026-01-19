'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateCustomerInput, CustomerTableData } from "@/types/customer";
import { calculateVehicleServiceStatus, getNextServiceDate } from "@/lib/serviceStatus";
import { ServiceType } from "@prisma/client";

export async function createCustomerWithVehicle(data: CreateCustomerInput) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const customer = await tx.customer.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                    address: data.address,
                },
            });


            const vehicle = await tx.vehicle.create({
                data: {
                    customerId: customer.id,
                    chassisNumber: data.chassisNumber,
                    engineNumber: data.engineNumber,
                    model: data.model,
                    branch: data.branch,
                    hmr: data.hmr || null,
                    warrantyStatus: data.warrantyStatus,
                    saleDate: data.saleDate,
                    lastServiceDate: null,
                    serviceStatus: "up_to_date",
                },
            });


            return { customer, vehicle };
        });


        revalidatePath('/customers');
        return {
            success: true,
            message: 'Customer and vehicle added successfully',
            data: result
        };
    } catch (error) {
        console.error('Error creating customer:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to add customer and vehicle'
        };
    }
}

export async function getCustomersWithVehicles(): Promise<CustomerTableData[]> {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                vehicles: {
                    include: {
                        services: {
                            orderBy: {
                                serviceDate: 'desc',
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const tableData: CustomerTableData[] = customers.flatMap((customer) =>
            customer.vehicles.map((vehicle) => {
                const serviceStatus = calculateVehicleServiceStatus(
                    vehicle.services.map((s) => ({
                        serviceType: s.serviceType,
                        serviceDate: s.serviceDate,
                    }))
                );

                const lastService = vehicle.services[0];
                const lastServiceDate = lastService?.serviceDate || vehicle.saleDate;
                const nextServiceDate = getNextServiceDate(
                    lastServiceDate,
                    lastService?.serviceType || ("engine_oil" as ServiceType)
                );

                return {
                    id: vehicle.id,
                    customerId: customer.id,
                    vehicleId: vehicle.id,
                    name: customer.name,
                    chassis: vehicle.chassisNumber,
                    model: vehicle.model,
                    phone: customer.phone,
                    email: customer.email,
                    address: customer.address,
                    engineNumber: vehicle.engineNumber,
                    branch: vehicle.branch,
                    hmr: vehicle.hmr,
                    warrantyStatus: vehicle.warrantyStatus,
                    saleDate: vehicle.saleDate.toISOString().split('T')[0],
                    lastService: lastServiceDate.toISOString().split('T')[0],
                    nextService: nextServiceDate.toISOString().split('T')[0],
                    status: serviceStatus,
                };
            })
        );

        return tableData;
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
}

export async function getCustomers() {
    return prisma.customer.findMany({
        include: {
            vehicles: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function updateCustomerWithVehicle(
    customerId: number,
    vehicleId: number,
    data: CreateCustomerInput
) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const customer = await tx.customer.update({
                where: { id: customerId },
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                    address: data.address,
                },
            });


            const vehicle = await tx.vehicle.update({
                where: { id: vehicleId },
                data: {
                    chassisNumber: data.chassisNumber,
                    engineNumber: data.engineNumber,
                    model: data.model,
                    branch: data.branch,
                    hmr: data.hmr || null,
                    warrantyStatus: data.warrantyStatus,
                    saleDate: data.saleDate,
                },
            });


            return { customer, vehicle };
        });


        revalidatePath('/customers');
        return {
            success: true,
            message: 'Customer and vehicle updated successfully',
            data: result
        };
    } catch (error) {
        console.error('Error updating customer:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update customer and vehicle'
        };
    }
}

export async function getCustomerWithVehicle(customerId: number, vehicleId: number) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                vehicles: {
                    where: { id: vehicleId },
                },
            },
        });

        if (!customer || customer.vehicles.length === 0) {
            return {
                success: false,
                message: 'Customer or vehicle not found',
                data: null
            };
        }

        return {
            success: true,
            data: {
                customer,
                vehicle: customer.vehicles[0]
            }
        };
    } catch (error) {
        console.error('Error fetching customer:', error);
        return {
            success: false,
            message: 'Failed to fetch customer data',
            data: null
        };
    }
}

export async function deleteCustomer(id: number) {
    try {
        await prisma.customer.delete({
            where: { id },
        });

        revalidatePath('/customers');
        return {
            success: true,
            message: 'Customer and related data deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting customer:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete customer'
        };
    }
}