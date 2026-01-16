import { ServiceStatus, ServiceType } from "@prisma/client";
import { addMonths, differenceInDays, startOfDay } from "date-fns";

// Service interval constants (in months)
export const ENGINE_OIL_MONTHS = 3;
export const TRANSMISSION_OIL_MONTHS = 12;

/**
 * Calculate the next service date based on the last service date and service type
 */
export function getNextServiceDate(
  lastServiceDate: Date,
  serviceType: ServiceType
): Date {
  const monthsToAdd =
    serviceType === "engine_oil"
      ? ENGINE_OIL_MONTHS
      : serviceType === "transmission"
        ? TRANSMISSION_OIL_MONTHS
        : ENGINE_OIL_MONTHS; // Default to engine oil interval for "other"

  return addMonths(lastServiceDate, monthsToAdd);
}

/**
 * Calculate days until the next service is due
 */
export function getDaysUntilService(nextServiceDate: Date): number {
  const today = startOfDay(new Date());
  const next = startOfDay(nextServiceDate);

  return differenceInDays(next, today);
}

/**
 * Calculate the service status based on the last service date and service type
 */
export function calculateServiceStatus(
  lastServiceDate: Date | null,
  serviceType: ServiceType = "engine_oil"
): ServiceStatus {
  // If no service history, use a conservative approach
  if (!lastServiceDate) {
    return "up_to_date";
  }

  const nextServiceDate = getNextServiceDate(lastServiceDate, serviceType);
  const daysUntil = getDaysUntilService(nextServiceDate);

  if (daysUntil < 0) {
    return "expired";
  } else if (daysUntil <= 3) {
    return "expire_3_days";
  } else if (daysUntil <= 7) {
    return "expire_7_days";
  } else {
    return "up_to_date";
  }
}

/**
 * Determine the most critical service status from multiple service records
 * Priority: expired > expire_3_days > expire_7_days > up_to_date
 */
export function getMostCriticalStatus(
  statuses: ServiceStatus[]
): ServiceStatus {
  if (statuses.includes("expired")) return "expired";
  if (statuses.includes("expire_3_days")) return "expire_3_days";
  if (statuses.includes("expire_7_days")) return "expire_7_days";
  return "up_to_date";
}

/**
 * Calculate overall vehicle service status based on all service records
 */
export function calculateVehicleServiceStatus(
  serviceRecords: Array<{ serviceType: ServiceType; serviceDate: Date }>
): ServiceStatus {
  if (serviceRecords.length === 0) {
    return "up_to_date";
  }

  // Group by service type and get the most recent for each
  const latestServices = new Map<ServiceType, Date>();

  serviceRecords.forEach((record) => {
    const current = latestServices.get(record.serviceType);
    if (!current || record.serviceDate > current) {
      latestServices.set(record.serviceType, record.serviceDate);
    }
  });

  // Calculate status for each service type
  const statuses: ServiceStatus[] = [];
  latestServices.forEach((date, type) => {
    statuses.push(calculateServiceStatus(date, type));
  });

  // Return the most critical status
  return getMostCriticalStatus(statuses);
}

/**
 * Get a human-readable status label
 */
export function getStatusLabel(status: ServiceStatus): string {
  switch (status) {
    case "up_to_date":
      return "Up to Date";
    case "expire_7_days":
      return "Due in 7 Days";
    case "expire_3_days":
      return "Due in 3 Days";
    case "expired":
      return "Overdue";
    default:
      return status;
  }
}

/**
 * Get status badge color classes
 */
export function getStatusBadgeClass(status: ServiceStatus): string {
  switch (status) {
    case "up_to_date":
      return "bg-green-100 text-green-700";
    case "expire_7_days":
      return "bg-yellow-100 text-yellow-700";
    case "expire_3_days":
      return "bg-orange-100 text-orange-700";
    case "expired":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
