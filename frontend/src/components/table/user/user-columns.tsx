import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@prisma/client";

export type UserTableData = User;
   
function getRoleBadge(role: UserRole) {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700";
    case "staff":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "admin":
      return "Admin";
    case "staff":
      return "Staff";
    default:
      return role;
  }
}

export function createUserColumns(
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onHardDelete: (user: User) => void,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.getValue("phone") || "-",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(
              role
            )}`}
          >
            {getRoleLabel(role)}
          </span>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                Edit
              </DropdownMenuItem>
              {user.role !== "admin" && (
                <>
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-orange-600"
                  >
                    Deactivate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onHardDelete(user)}
                    className="text-red-600"
                  >
                    Delete Permanently
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
