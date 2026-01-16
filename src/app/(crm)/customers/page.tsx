import { DataTable } from "@/components/table/customer/data-table";
import { columns } from "@/components/table/customer/columns";
import CreateOrEdit from "@/components/modal/customer/CreateOrEdit";
import { getCustomersWithVehicles } from "@/app/actions/customer";

export default async function Page() {
  const data = await getCustomersWithVehicles();
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
    </div>
  );
}
