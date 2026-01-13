"use client";

import React, { useState } from "react";
import { useCreateCustomer, useCustomers } from "@/hooks/useCustomerMutations";
import { Customer } from "@/types/customer";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { data: customers = [], isLoading } = useCustomers();

  const createMutation = useCreateCustomer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", phone: "" });
      },
    });
  };

  return (
    <div>
      <div>
        <h1>Add New Customer</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </label>
          <br />
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Adding..." : "Add Customer"}
          </button>
          {createMutation.isError && (
            <p style={{ color: "red" }}>Error adding customer</p>
          )}
          {createMutation.isSuccess && (
            <p style={{ color: "green" }}>Customer added successfully!</p>
          )}
        </form>
      </div>

      <div>
        <h2>Customer List</h2>
        {isLoading ? (
          <p>Loading customers...</p>
        ) : (
          <ul>
            {customers.map((customer: Customer) => (
              <li key={customer.id}>
                {customer.name} - {customer.email} - {customer.phone ?? ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
