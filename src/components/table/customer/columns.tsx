"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Calendar } from "lucide-react";
import { ServiceStatus } from "@prisma/client";

function getStatusBadge(status: ServiceStatus) {
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

function getStatusLabel(status: ServiceStatus) {
  switch (status) {
    case "up_to_date":
      return "Up to Date";
    case "expire_7_days":
      return "Expires in 7 Days";
    case "expire_3_days":
      return "Expires in 3 Days";
    case "expired":
      return "Expired";
    default:
      return status;
  }
}

export type Customer = {
  id: number;
  name: string;
  chassis: string;
  model: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: ServiceStatus;
};

export const columns: ColumnDef<Customer>[] = [
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
  },
  {
    accessorKey: "nextService",
    header: "Next Service",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ServiceStatus;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
            status
          )}`}
        >
          {getStatusLabel(status)}
        </span>
      );
    },
  },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const customer = row.original;

  //       return (
  //         <div className="flex items-center gap-2">
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="p-1"
  //             title="View details"
  //             onClick={() => console.log("View", customer.id)}
  //           >
  //             <Eye className="w-4 h-4 text-primary" />
  //           </Button>
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="p-1"
  //             title="Edit customer"
  //             onClick={() => console.log("Edit", customer.id)}
  //           >
  //             <Pencil className="w-4 h-4 text-primary" />
  //           </Button>
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="p-1"
  //             title="Schedule service"
  //             onClick={() => console.log("Schedule", customer.id)}
  //           >
  //             <Calendar className="w-4 h-4 text-primary" />
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
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
            <DropdownMenuItem onClick={() => console.log("View", customer.id)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit", customer.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Schedule", customer.id)}
            >
              Schedule Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
