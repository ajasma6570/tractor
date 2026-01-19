import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceStatus, WarrantyStatus } from "@prisma/client";
import { getStatusBadgeClass, getStatusLabel } from "@/lib/serviceStatus";
import { format } from "date-fns";

export type Customer = {
  id: number;
  customerId: number;
  vehicleId: number;
  name: string;
  chassis: string;
  model: string;
  phone: string;
  email: string | null;
  address: string;
  engineNumber: string;
  branch: string;
  hmr: number | null;
  warrantyStatus: WarrantyStatus;
  saleDate: string;
  lastService: string;
  nextService: string;
  status: ServiceStatus;
};

export function createColumns(
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void,
): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "chassis",
      header: "Chassis Number",
      cell: ({ row }) => (
        <div className="font-mono text-muted-foreground">
          {row.getValue("chassis")}
        </div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "lastService",
      header: "Last Service",
      cell: ({ row }) => (
        <div>
          {format(
            new Date(row.getValue("lastService") as string),
            "dd-MM-yyyy",
          )}
        </div>
      ),
    },
    {
      accessorKey: "nextService",
      header: "Next Service",
      cell: ({ row }) => (
        <div>
          {format(
            new Date(row.getValue("nextService") as string),
            "dd-MM-yyyy",
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ServiceStatus;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
              status,
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => console.log("View", customer.id)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Schedule", customer.id)}
              >
                Schedule Service
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(customer)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
