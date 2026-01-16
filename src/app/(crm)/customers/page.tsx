// "use client";

// import React, { useState } from "react";
// import { useCreateCustomer, useCustomers } from "@/hooks/useCustomerMutations";
// import { User } from "@prisma/client";
import { DataTable } from "@/components/table/customer/data-table";
import { columns } from "@/components/table/customer/columns";
import { Customer } from "@/components/table/customer/columns";
import AddCustomer from "@/components/modal/AddCustomer";

async function getData(): Promise<Customer[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      name: "John Deere Farm",
      chassis: "JD-2024-001",
      model: "John Deere 8400R",
      phone: "(555) 123-4567",
      lastService: "2024-01-10",
      nextService: "2024-04-10",
      status: "up-to-date",
    },
    {
      id: 2,
      name: "Green Valley Farms",
      chassis: "GV-2024-012",
      model: "Case IH Magnum",
      phone: "(555) 234-5678",
      lastService: "2024-01-05",
      nextService: "2024-04-05",
      status: "expire-soon",
    },
    {
      id: 3,
      name: "Prairie Harvest",
      chassis: "PH-2024-005",
      model: "CLAAS Axion 800",
      phone: "(555) 345-6789",
      lastService: "2023-12-15",
      nextService: "2024-03-15",
      status: "expired",
    },
    {
      id: 4,
      name: "Harvest Gold Co",
      chassis: "HG-2024-008",
      model: "Massey Ferguson 7720",
      phone: "(555) 456-7890",
      lastService: "2024-01-15",
      nextService: "2024-04-15",
      status: "up-to-date",
    },
    {
      id: 5,
      name: "Midwest Operations",
      chassis: "MO-2024-020",
      model: "Deutz-Fahr Agrotron",
      phone: "(555) 567-8901",
      lastService: "2024-01-08",
      nextService: "2024-04-08",
      status: "expire-soon",
    },
  ];
}

export default async function Page() {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  // });

  // const { data: customers = [], isLoading } = useCustomers();

  // const createMutation = useCreateCustomer();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   createMutation.mutate(formData, {
  //     onSuccess: () => {
  //       setFormData({ name: "", email: "", phone: "" });
  //     },
  //   });
  // };
  const data = await getData();
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center items-center w-full">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer information and service schedules
          </p>
        </div>
        <AddCustomer />
      </div>
      {/* <div>
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
              {customers.map((customer: User) => (
                <li key={customer.id}>
                  {customer.name} - {customer.email} - {customer.phone ?? ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div> */}

      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
