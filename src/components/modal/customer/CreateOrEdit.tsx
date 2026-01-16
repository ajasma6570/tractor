"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Truck } from "lucide-react";
import { createCustomerWithVehicle, updateCustomerWithVehicle } from "@/app/actions/customer";
import { WarrantyStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface CustomerData {
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
}

interface CreateOrEditProps {
  customerData?: CustomerData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function CreateOrEdit({ customerData, open: controlledOpen, onOpenChange, trigger }: CreateOrEditProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;
  
  const isEditMode = !!customerData;
  
  const [formData, setFormData] = useState({
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
  });

  // Prefill form when editing
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
        saleDate: new Date(customerData.saleDate).toISOString().split('T')[0],
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        chassisNumber: "",
        engineNumber: "",
        model: "",
        branch: "",
        hmr: "",
        warrantyStatus: "in_warranty",
        saleDate: "",
      });
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
            payload
          )
        : await createCustomerWithVehicle(payload);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button>Add New Customer</Button>
        </DialogTrigger>
      )}
      <DialogContent className="p-4 max-h-[90vh] overflow-y-auto max-w-3xl!">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update customer and vehicle details" : "Enter customer and vehicle details"}
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
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter customer name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="customer@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter full address"
                      rows={2}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-200"></div>
            {/* Vehicle Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-900">
                  Vehicle Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Chassis Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.chassisNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chassisNumber: e.target.value,
                      })
                    }
                    placeholder="e.g., JD5425H890123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Engine Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.engineNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engineNumber: e.target.value,
                      })
                    }
                    placeholder="e.g., ENG123456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Tractor Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select model</option>
                    <option value="John Deere 5425">John Deere 5425</option>
                    <option value="John Deere 5310">John Deere 5310</option>
                    <option value="John Deere 6420">John Deere 6420</option>
                    <option value="Massey Ferguson 7250">
                      Massey Ferguson 7250
                    </option>
                    <option value="Massey Ferguson 1035">
                      Massey Ferguson 1035
                    </option>
                    <option value="Massey Ferguson 2635">
                      Massey Ferguson 2635
                    </option>
                    <option value="Swaraj 735 FE">Swaraj 735 FE</option>
                    <option value="Swaraj 855 FE">Swaraj 855 FE</option>
                    <option value="Swaraj 744 FE">Swaraj 744 FE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({ ...formData, branch: e.target.value })
                    }
                    placeholder="e.g., Karur, Chennai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    HMR (Hour Meter Reading)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hmr}
                    onChange={(e) =>
                      setFormData({ ...formData, hmr: e.target.value })
                    }
                    placeholder="e.g., 1500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Warranty Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.warrantyStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyStatus: e.target.value as WarrantyStatus,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="in_warranty">In Warranty</option>
                    <option value="out_warranty">Out of Warranty</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                    Sale Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.saleDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        saleDate: e.target.value,
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Adding...") 
                  : (isEditMode ? "Update Customer" : "Add Customer")
                }
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
