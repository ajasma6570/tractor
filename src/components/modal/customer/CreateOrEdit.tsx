"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { User, Truck } from "lucide-react";
import {
  createCustomerWithVehicle,
  updateCustomerWithVehicle,
} from "@/app/actions/customer";
import { WarrantyStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/custom/Form/form-input";
import { FormSelect } from "@/components/custom/Form/form-select";
import { Separator } from "@/components/ui/separator";
import { FormDatePicker } from "@/components/custom/Form/form-date-picker";
import { EditCustomerForm } from "@/types/models";

interface CreateOrEditProps {
  customerData?: EditCustomerForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  chassisNumber: "",
  engineNumber: "",
  model: "",
  branch: "",
  hmr: "",
  warrantyStatus: "in_warranty" as WarrantyStatus,
  saleDate: "",
};

export default function CreateOrEdit({
  customerData,
  open,
  onOpenChange,
  trigger,
}: CreateOrEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const isEditMode = !!customerData;

  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (customerData && open) {
      setFormData({
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email || "",
        address: customerData.address,
        chassisNumber: customerData.chassisNumber,
        engineNumber: customerData.engineNumber,
        model: customerData.model,
        branch: customerData.branch,
        hmr: customerData.hmr?.toString() || "",
        warrantyStatus: customerData.warrantyStatus,
        saleDate: new Date(customerData.saleDate).toISOString().split("T")[0],
      });
    } else if (!open) {
      setFormData(defaultValues);
    }
  }, [customerData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address,
        chassisNumber: formData.chassisNumber,
        engineNumber: formData.engineNumber,
        model: formData.model,
        branch: formData.branch,
        hmr: formData.hmr ? parseInt(formData.hmr) : undefined,
        warrantyStatus: formData.warrantyStatus,
        saleDate: new Date(formData.saleDate),
      };

      const result = isEditMode
        ? await updateCustomerWithVehicle(
            customerData!.customerId,
            customerData!.vehicleId,
            payload,
          )
        : await createCustomerWithVehicle(payload);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        onOpenChange?.(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const warrantyOptions = [
    { value: "in_warranty", label: "In Warranty" },
    { value: "out_warranty", label: "Out of Warranty" },
  ];

  console.log("customerData", customerData);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogTrigger asChild>
        <Button>Add New Customer</Button>
      </DialogTrigger>
      <DialogContent className="p-4 max-h-[90vh] overflow-y-auto max-w-3xl!">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update customer and vehicle details"
              : "Enter customer and vehicle details"}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="pt-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">
                  Customer Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  id="name"
                  placeholder="Enter customer name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <FormInput
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <div className="space-y-1.5">
                  <Label htmlFor="address">
                    Address<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    className="max-h-5"
                    placeholder="Enter full address"
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-900">
                  Vehicle Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Chassis Number"
                  type="text"
                  id="chassisNumber"
                  placeholder="JD5425H890123"
                  value={formData.chassisNumber}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, chassisNumber: e.target.value })
                  }
                />

                <FormInput
                  label="Engine Number"
                  type="text"
                  id="engineNumber"
                  placeholder="ENG123456"
                  value={formData.engineNumber}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, engineNumber: e.target.value })
                  }
                />

                <FormInput
                  label="Tractor Model"
                  type="text"
                  id="tractorModel"
                  placeholder="John Deere 5425"
                  value={formData.model}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />

                <FormInput
                  label="Branch"
                  type="text"
                  id="branch"
                  placeholder="Karur, Chennai"
                  value={formData.branch}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                />

                <FormInput
                  label="HMR (Hour Meter Reading)"
                  type="number"
                  id="hmr"
                  placeholder="1500"
                  value={formData.hmr}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, hmr: e.target.value })
                  }
                />

                <FormSelect
                  label="Warranty Status"
                  id="warrantyStatus"
                  value={formData.warrantyStatus}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      warrantyStatus: value as WarrantyStatus,
                    })
                  }
                  options={warrantyOptions}
                  placeholder="Select a warranty status"
                  required
                />

                <FormDatePicker
                  label="Sale Date"
                  id="saleDate"
                  value={
                    formData.saleDate ? new Date(formData.saleDate) : undefined
                  }
                  onValueChange={(date) =>
                    setFormData({
                      ...formData,
                      saleDate: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  placeholder="Select date"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Customer"
                    : "Add Customer"}
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
