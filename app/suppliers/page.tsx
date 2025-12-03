import Link from "next/link";
import { Supplier } from "@/utils/types";
import { getSuppliers } from "@/utils/api";
import SupplierTable from "@/components/suppliers/SupplierTable";
import StatisticsCards from "@/components/suppliers/StatisticsCards";

export default async function SupplierListPage() {
  // Server-side data fetching
  const suppliersData = await getSuppliers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <Link 
          href="/suppliers/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Supplier
        </Link>
      </div>

      <SupplierTable initialSuppliers={suppliersData} />
      <StatisticsCards suppliers={suppliersData} />
    </div>
  );
}