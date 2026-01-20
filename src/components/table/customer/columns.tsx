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

function getStatusUI(status: string) {
  switch (status) {
    case "expired":
      return { label: "Expired", color: "bg-red-500" };
    case "expire_3_days":
      return { label: "3 Days", color: "bg-orange-500" };
    case "expire_7_days":
      return { label: "7 Days", color: "bg-yellow-500" };
    default:
      return { label: "OK", color: "bg-green-500" };
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
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "chassis",
      header: "Vehicle",
    },

    {
      header: "Engine Oil",
      cell: ({ row }) => {
        const status = row.original.engineStatus;
        const next = row.original.engineNext;
        const ui = getStatusUI(status);

        return (
          <div className="space-y-1">
            <span
              className={`text-white text-xs px-2 py-1 rounded ${ui.color}`}
            >
              {ui.label}
            </span>

            {next && (
              <div className="text-xs text-muted-foreground">
                Due: {format(new Date(next), "dd MMM")}
              </div>
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
        const ui = getStatusUI(status);

        return (
          <div className="space-y-1">
            <span
              className={`text-white text-xs px-2 py-1 rounded ${ui.color}`}
            >
              {ui.label}
            </span>

            {next && (
              <div className="text-xs text-muted-foreground">
                Due: {format(new Date(next), "dd MMM")}
              </div>
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
