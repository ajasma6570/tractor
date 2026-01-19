"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/customer/data-table";
import { createUserColumns } from "@/components/table/user/user-columns";
import { createTechnicianColumns } from "@/components/table/technician/technician-columns";
import CreateOrEditUser from "@/components/modal/user/CreateOrEditUser";
import CreateOrEditTechnician from "@/components/modal/technician/CreateOrEditTechnician";
import { getUsers, deleteUser, hardDeleteUser } from "@/app/actions/user";
import {
  getTechnicians,
  deleteTechnician,
  hardDeleteTechnician,
} from "@/app/actions/technician";
import { User, Technician } from "@prisma/client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "technicians">("users");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(
    null,
  );
  const [technicianModalOpen, setTechnicianModalOpen] = useState(false);

  // Use TanStack Query for users data
  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: true,
    enabled: status === "authenticated",
  });

  // Use TanStack Query for technicians data
  const {
    data: technicians = [],
    isLoading: techniciansLoading,
    refetch: refetchTechnicians,
  } = useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    refetchOnWindowFocus: true,
    enabled: status === "authenticated",
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast.success(result.message);
        refetchUsers();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleHardDeleteUser = async (user: User) => {
    if (
      confirm(
        `Are you sure you want to PERMANENTLY delete user ${user.name}? This action cannot be undone.`,
      )
    ) {
      const result = await hardDeleteUser(user.id);
      if (result.success) {
        toast.success(result.message);
        refetchUsers();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleEditTechnician = (technician: Technician) => {
    setEditingTechnician(technician);
    setTechnicianModalOpen(true);
  };

  const handleDeleteTechnician = async (technician: Technician) => {
    if (confirm(`Are you sure you want to deactivate ${technician.name}?`)) {
      const result = await deleteTechnician(technician.id);
      if (result.success) {
        toast.success(result.message);
        refetchTechnicians();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleHardDeleteTechnician = async (technician: Technician) => {
    if (
      confirm(
        `Are you sure you want to PERMANENTLY delete technician ${technician.name}? This action cannot be undone.`,
      )
    ) {
      const result = await hardDeleteTechnician(technician.id);
      if (result.success) {
        toast.success(result.message);
        refetchTechnicians();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleUserModalClose = (open: boolean) => {
    setUserModalOpen(open);
    if (!open) {
      setEditingUser(null);
      refetchUsers();
    }
  };

  const handleTechnicianModalClose = (open: boolean) => {
    setTechnicianModalOpen(open);
    if (!open) {
      setEditingTechnician(null);
      refetchTechnicians();
    }
  };

  const userColumns = createUserColumns(
    handleEditUser,
    handleDeleteUser,
    handleHardDeleteUser,
  );
  const technicianColumns = createTechnicianColumns(
    handleEditTechnician,
    handleDeleteTechnician,
    handleHardDeleteTechnician,
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and technicians
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("technicians")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "technicians"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Technicians ({technicians.length})
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <div className="mb-4 flex justify-end">
            <CreateOrEditUser />
          </div>
          <DataTable
            columns={userColumns}
            data={users}
            isLoading={usersLoading}
          />

          {/* Edit User Modal */}
          {editingUser && (
            <CreateOrEditUser
              userData={editingUser}
              open={userModalOpen}
              onOpenChange={handleUserModalClose}
            />
          )}
        </div>
      )}

      {/* Technicians Tab */}
      {activeTab === "technicians" && (
        <div>
          <div className="mb-4 flex justify-end">
            <CreateOrEditTechnician />
          </div>
          <DataTable
            columns={technicianColumns}
            data={technicians}
            isLoading={techniciansLoading}
          />

          {/* Edit Technician Modal */}
          {editingTechnician && (
            <CreateOrEditTechnician
              technicianData={editingTechnician}
              open={technicianModalOpen}
              onOpenChange={handleTechnicianModalClose}
            />
          )}
        </div>
      )}
    </div>
  );
}
