import { Customer as PrismaCustomer, Vehicle, ServiceStatus, WarrantyStatus } from "@prisma/client";

export type Customer = PrismaCustomer;

export type CustomerWithVehicles = PrismaCustomer & {
    vehicles: Vehicle[];
};

export type CreateCustomerInput = {
    // Customer fields
    name: string;
    phone: string;
    email?: string;
    address: string;

    // Vehicle fields
    chassisNumber: string;
    engineNumber: string;
    model: string;
    branch: string;
    hmr?: number;
    warrantyStatus: WarrantyStatus;
    saleDate: Date;
};

export type CustomerTableData = {
    id: number;
    name: string;
    chassis: string;
    model: string;
    phone: string;
    lastService: string;
    nextService: string;
    status: ServiceStatus;
};
