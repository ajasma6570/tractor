import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { CustomerTableData } from "@/types/models";
import { ReminderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/custom/Badge";

export function getStatusBadge(status: ReminderStatus) {
  switch (status) {
    case "expired":
      return (
        <StatusBadge color="red" value="Expired" title="Service expired" />
      );

    case "expire_3_days":
      return (
        <StatusBadge color="yellow" value="3 Days" title="Due in 3 days" />
      );

    case "expire_7_days":
      return <StatusBadge color="blue" value="7 Days" title="Due in 7 days" />;

    default:
      return (
        <StatusBadge
          color="green"
          value="Up to Date"
          title="Service up to date"
        />
      );
  }
}

export function createCustomerColumns(
  onEdit: (customer: CustomerTableData) => void,
  onDelete: (customer: CustomerTableData) => void,
): ColumnDef<CustomerTableData>[] {
  return [
    {
      accessorKey: "name",
      header: "Customer",
    },
    {
      accessorKey: "chassis",
      header: "Chassis Number",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "warrantyStatus",
      header: "Warranty Status",
      cell: ({ row }) => {
        const status = row.getValue("warrantyStatus") as string;

        return status === "in_warranty" ? (
          <StatusBadge color="green" value="In Warranty" />
        ) : (
          <StatusBadge color="default" value="Out of Warranty" />
        );
      },
    },
    {
      header: "Engine Oil",
      cell: ({ row }) => {
        const status = row.original.engineStatus;
        const next = row.original.engineNext;

        return (
          <div className="space-y-1">
            {getStatusBadge(status)}
            {next && (
              <p className="text-sm  font-medium">
                Next: {format(new Date(next), "dd-MM-yyyy")}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Transmission",
      cell: ({ row }) => {
        const status = row.original.transmissionStatus;
        const next = row.original.transmissionNext;

        return (
          <div className="space-y-1">
            {getStatusBadge(status)}

            {next && (
              <p className="text-sm  font-medium">
                Next: {format(new Date(next), "dd-MM-yyyy")}
              </p>
            )}
          </div>
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>View</DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(customer)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem>Schedule Service</DropdownMenuItem>

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
