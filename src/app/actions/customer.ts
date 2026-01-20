'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { addMonths, addYears } from "date-fns"
import { CustomerTableData } from "@/types/models"


function getEngineNext(date: Date) {
    return addMonths(date, 3)
}

function getTransmissionNext(date: Date) {
    return addYears(date, 1)
}

export async function createCustomerWithVehicle(data: {
    name: string
    phone: string
    email?: string
    address: string

    chassisNumber: string
    engineNumber: string
    model: string
    branch: string
    hmr?: number
    warrantyStatus: "in_warranty" | "out_of_warranty"
    saleDate: Date
}) {

    try {
        const result = await prisma.$transaction(async (tx) => {

            const customer = await tx.customer.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                    address: data.address,
                },
            })

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
                },
            })

            /* AUTO CREATE REMINDERS */

            await tx.serviceReminder.createMany({
                data: [
                    {
                        vehicleId: vehicle.id,
                        serviceType: "engine_oil",
                        baseDate: data.saleDate,
                        nextDue: getEngineNext(data.saleDate),
                        status: "up_to_date",
                    },
                    {
                        vehicleId: vehicle.id,
                        serviceType: "transmission",
                        baseDate: data.saleDate,
                        nextDue: getTransmissionNext(data.saleDate),
                        status: "up_to_date",
                    },
                ],
            })

            return { customer, vehicle }
        })

        revalidatePath("/customers")

        return {
            success: true,
            message: "Customer & vehicle created successfully",
            data: result
        }

    } catch (error) {
        console.error(error)
        return { success: false, message: "Creation failed" }
    }
}

/* ---------------------------------------
   GET CUSTOMER TABLE DATA
----------------------------------------*/


export async function getCustomersWithVehicles(): Promise<CustomerTableData[]> {

    const customers = await prisma.customer.findMany({
        include: {
            vehicles: {
                include: {
                    reminders: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return customers.flatMap(c =>
        c.vehicles.map(v => {

            const engine = v.reminders.find(
                r => r.serviceType === "engine_oil"
            )

            const trans = v.reminders.find(
                r => r.serviceType === "transmission"
            )

            return {
                customerId: c.id,
                vehicleId: v.id,

                name: c.name,
                phone: c.phone,
                email: c.email,
                address: c.address,

                chassis: v.chassisNumber,
                engineNumber: v.engineNumber,
                model: v.model,
                branch: v.branch,
                hmr: v.hmr,
                warrantyStatus: v.warrantyStatus,
                saleDate: v.saleDate,

                /* ENGINE */
                engineStatus: (engine?.status ?? "up_to_date") as CustomerTableData["engineStatus"],
                engineNext: engine?.nextDue ?? v.saleDate,

                /* TRANSMISSION */
                transmissionStatus: (trans?.status ?? "up_to_date") as CustomerTableData["transmissionStatus"],
                transmissionNext: trans?.nextDue ?? v.saleDate,
            }
        })
    )
}


/* ---------------------------------------
   GET ALL CUSTOMERS
----------------------------------------*/

export async function getCustomers() {
    return prisma.customer.findMany({
        include: { vehicles: true },
        orderBy: { createdAt: "desc" },
    })
}

/* ---------------------------------------
   GET SINGLE CUSTOMER + VEHICLE
----------------------------------------*/

export async function getCustomerWithVehicle(
    customerId: number,
    vehicleId: number
) {

    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            vehicles: {
                where: { id: vehicleId },
                include: {
                    reminders: true,
                    services: true,
                }
            },
        },
    })

    if (!customer || customer.vehicles.length === 0) {
        return { success: false }
    }

    return {
        success: true,
        data: {
            customer,
            vehicle: customer.vehicles[0]
        }
    }
}

/* ---------------------------------------
   UPDATE CUSTOMER + VEHICLE
----------------------------------------*/

export async function updateCustomerWithVehicle(
    customerId: number,
    vehicleId: number,
    data: {
        name: string
        phone: string
        email?: string
        address: string

        chassisNumber: string
        engineNumber: string
        model: string
        branch: string
        hmr?: number
        warrantyStatus: "in_warranty" | "out_of_warranty"
        saleDate: Date
    }
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
            })

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
            })

            return { customer, vehicle }
        })

        revalidatePath("/customers")


        return {
            success: true,
            message: "Updated successfully",
            data: result
        }

    } catch (error) {
        console.error(error)
        return { success: false, message: "Update failed" }
    }
}

/* ---------------------------------------
   DELETE CUSTOMER
----------------------------------------*/

export async function deleteCustomer(id: number) {

    try {

        await prisma.customer.delete({
            where: { id }
        })

        revalidatePath("/customers")

        return {
            success: true,
            message: "Customer deleted successfully"
        }

    } catch (error) {
        console.error(error)
        return { success: false, message: "Delete failed" }
    }
}
