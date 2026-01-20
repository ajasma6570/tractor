"use client";

import { DataTable } from "@/components/table/customer/data-table";
import { createCustomerColumns } from "@/components/table/customer/columns";
import CreateOrEdit from "@/components/modal/customer/CreateOrEdit";
import {
  getCustomersWithVehicles,
  deleteCustomer,
} from "@/app/actions/customer";
import { useState } from "react";
import toast from "react-hot-toast";
import { CustomerTableData, EditCustomerForm } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [editingCustomer, setEditingCustomer] =
    useState<EditCustomerForm | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersWithVehicles,
    refetchOnWindowFocus: true,
  });

  const handleEdit = (customer: CustomerTableData) => {
    setEditingCustomer({
      customerId: customer.customerId,
      vehicleId: customer.vehicleId,

      // CUSTOMER
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address,

      // VEHICLE
      chassisNumber: customer.chassis,
      engineNumber: customer.engineNumber,
      model: customer.model,
      branch: customer.branch,
      hmr: customer.hmr ?? undefined,
      warrantyStatus: customer.warrantyStatus,

      // DATE
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
  const handleDelete = async (customer: CustomerTableData) => {
    if (
      confirm(
        `Are you sure you want to delete ${customer.name} and all their related data (vehicles, services, etc.)?`,
      )
    ) {
      const result = await deleteCustomer(customer.customerId);
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message);
      }
    }
  };

  const columns = createCustomerColumns(handleEdit, handleDelete);

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center items-center w-full">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer information and service schedules
          </p>
        </div>
        <CreateOrEdit
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>

      <div>
        <DataTable columns={columns} data={data} isLoading={isLoading} />
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
