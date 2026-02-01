export type UserRole = "admin" | "staff"

export type WarrantyStatus =
    | "in_warranty"
    | "out_of_warranty"

export type ServiceType =
    | "engine_oil"
    | "transmission"

export type ReminderStatus =
    | "up_to_date"
    | "expire_7_days"
    | "expire_3_days"
    | "expired"

export type CallStatus =
    | "called"
    | "not_answered"
    | "rescheduled"

export type BookingStatus =
    | "booked"
    | "not_booked"
    | "pending"
    | "completed"

export type SchedulePriority =
    | "normal"
    | "urgent"

export type AuditAction =
    | "create"
    | "update"
    | "delete"
    | "login"
    | "status_change"


export interface User {
    id: number
    name: string
    username: string
    email: string
    password: string
    phone?: string
    role: UserRole
    isActive: boolean
    createdAt: Date
}

export interface Vehicle {
    id: number
    customerId: number

    chassisNumber: string
    engineNumber: string
    model: string
    branch: string
    hmr?: number | null

    warrantyStatus: WarrantyStatus
    saleDate: Date
    createdAt: Date
}

export interface Technician {
    id: number
    name: string
    phone: string
    branch: string
    isActive: boolean
    createdAt: Date
}

export interface ServiceReminder {
    id: number
    vehicleId: number
    serviceType: ServiceType

    baseDate: Date
    nextDue: Date
    status: ReminderStatus

    isHandled: boolean
    createdAt: Date
}

export interface ServiceHistory {
    id: number
    vehicleId: number
    serviceDate: Date
    notes: string

    engineOil: boolean
    transmission: boolean
    otherWork: boolean

    createdAt: Date
}

export interface ServiceSchedule {
    id: number
    vehicleId: number
    customerId: number

    bookingDate: Date
    bookingTime: string
    closingDate?: Date | null

    technicianId?: number | null
    serviceType: ServiceType
    status: BookingStatus
    priority: SchedulePriority

    createdAt: Date
}

export interface CallRegister {
    id: number
    vehicleId: number
    customerId: number

    callDate: Date
    callStatus: CallStatus

    remarks?: string | null
    calledById: number

    createdAt: Date
}

// export interface AuditLog {
//     id: number
//     userId?: number | null

//     action: AuditAction
//     entity: string
//     entityId?: number | null

//     oldData?: any
//     newData?: any

//     ipAddress?: string | null
//     userAgent?: string | null

//     createdAt: Date
// }

export type CustomerTableData = {
    customerId: number
    vehicleId: number

    name: string
    phone: string
    email: string | null
    address: string

    chassis: string
    engineNumber: string
    model: string
    branch: string

    hmr?: number | null

    warrantyStatus: WarrantyStatus
    saleDate: Date

    /* ENGINE */
    engineStatus: ReminderStatus
    engineNext: Date

    /* TRANSMISSION */
    transmissionStatus: ReminderStatus
    transmissionNext: Date
}

export type CreateCustomerForm = {
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
}


export type EditCustomerForm = {
    customerId: number;
    vehicleId: number;

    // CUSTOMER
    name: string;
    phone: string;
    email: string;
    address: string;

    // VEHICLE
    chassisNumber: string;
    engineNumber: string;
    model: string;
    branch: string;
    hmr?: number;

    warrantyStatus: WarrantyStatus;
    saleDate: Date;
};
