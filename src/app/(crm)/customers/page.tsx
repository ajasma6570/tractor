"use client";

import { DataTable } from "@/components/table/customer/data-table";
import { createColumns } from "@/components/table/customer/columns";
import CreateOrEdit from "@/components/modal/customer/CreateOrEdit";
import { getCustomersWithVehicles } from "@/app/actions/customer";
import { useState } from "react";
import { CustomerTableData } from "@/types/customer";
import { WarrantyStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [editingCustomer, setEditingCustomer] = useState<{
    customerId: number;
    vehicleId: number;
    name: string;
    phone: string;
    email: string | null;
    address: string;
    chassisNumber: string;
    engineNumber: string;
    model: string;
    branch: string;
    hmr: number | null;
    warrantyStatus: WarrantyStatus;
    saleDate: Date;
  } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Use TanStack Query for data fetching
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersWithVehicles,
    refetchOnWindowFocus: true,
  });

  const handleEdit = (customer: CustomerTableData) => {
    setEditingCustomer({
      customerId: customer.customerId,
      vehicleId: customer.vehicleId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      chassisNumber: customer.chassis,
      engineNumber: customer.engineNumber,
      model: customer.model,
      branch: customer.branch,
      hmr: customer.hmr,
      warrantyStatus: customer.warrantyStatus,
      saleDate: new Date(customer.saleDate),
    });
    setEditModalOpen(true);
  };

  const handleEditClose = (open: boolean) => {
    setEditModalOpen(open);
    if (!open) {
      setEditingCustomer(null);
      refetch(); // Refetch data after edit
    }
  };

  const columns = createColumns(handleEdit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center items-center w-full">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer information and service schedules
          </p>
        </div>
        <CreateOrEdit />
      </div>

      <div>
        <DataTable columns={columns} data={data} />
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <CreateOrEdit
          customerData={editingCustomer}
          open={editModalOpen}
          onOpenChange={handleEditClose}
        />
      )}
    </div>
  );
}
