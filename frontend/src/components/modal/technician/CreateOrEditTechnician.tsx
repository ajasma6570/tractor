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
import { User, Phone, MapPin } from "lucide-react";
import { createTechnician, updateTechnician } from "@/app/actions/technician";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { FormInput } from "@/components/custom/Form/form-input";
import { FormSwitch } from "@/components/custom/Form/form-switch";

interface TechnicianData {
  id: number;
  name: string;
  phone: string;
  branch: string;
  isActive: boolean;
}

interface CreateOrEditTechnicianProps {
  technicianData?: TechnicianData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function CreateOrEditTechnician({
  technicianData,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: CreateOrEditTechnicianProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

  const isEditMode = !!technicianData;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: "",
    isActive: true,
  });

  useEffect(() => {
    if (technicianData && open) {
      setFormData({
        name: technicianData.name,
        phone: technicianData.phone,
        branch: technicianData.branch,
        isActive: technicianData.isActive,
      });
    } else if (!open) {
      setFormData({
        name: "",
        phone: "",
        branch: "",
        isActive: true,
      });
    }
  }, [technicianData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        branch: formData.branch,
        isActive: formData.isActive,
      };

      const result = isEditMode
        ? await updateTechnician(technicianData!.id, payload)
        : await createTechnician(payload);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["technicians"] });
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch {
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
          <Button>Add New Technician</Button>
        </DialogTrigger>
      )}
      <DialogContent className="p-4 max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Technician" : "Add New Technician"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update technician details"
              : "Create a new technician"}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="pt-6 space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter full name"
            />

            <FormInput
              label="Phone Number"
              type="text"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />

            <FormInput
              label="Branch"
              type="text"
              id="branch"
              required
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              placeholder="Enter branch"
            />

            <FormSwitch
              id="active-technician"
              label="  Active Technician"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Technician"
                    : "Create Technician"}
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
