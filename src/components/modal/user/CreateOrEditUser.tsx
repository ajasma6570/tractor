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
import { createUser, updateUser } from "@/app/actions/user";
import { UserRole } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { FormInput } from "@/components/custom/Form/form-input";
import { FormSelect } from "@/components/custom/Form/form-select";
import { FormSwitch } from "@/components/custom/Form/form-switch";

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
}

interface CreateOrEditUserProps {
  userData?: UserData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function CreateOrEditUser({
  userData,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: CreateOrEditUserProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

  const isEditMode = !!userData;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "staff" as UserRole,
    isActive: true,
  });

  useEffect(() => {
    if (userData && open) {
      setFormData({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone || "",
        password: "",
        role: userData.role,
        isActive: userData.isActive,
      });
    } else if (!open) {
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "staff",
        isActive: true,
      });
    }
  }, [userData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (!isEditMode || formData.password) {
        payload.password = formData.password;
      }

      const result = isEditMode
        ? await updateUser(userData!.id, payload)
        : await createUser(payload);

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
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

  const roleOptions = [
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button>Add New User</Button>
        </DialogTrigger>
      )}
      <DialogContent className="p-4 max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update user details and permissions"
              : "Create a new user account"}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />

              <FormInput
                label="Username"
                id="username"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
              />

              <FormInput
                label="Email Address"
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />

              <FormInput
                label="Phone Number"
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />

              <FormInput
                label="Password"
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
              />

              <FormSelect
                label="Role"
                id="role"
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    role: value as UserRole,
                  })
                }
                options={roleOptions}
                placeholder="Select a role"
                required
              />

              <FormSwitch
                id="active-user"
                label="Active User"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

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
                    ? "Update User"
                    : "Create User"}
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
