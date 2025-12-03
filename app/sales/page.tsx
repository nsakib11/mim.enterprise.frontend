import Link from "next/link";
import { Sales } from "@/utils/types";
import { getSales } from "@/utils/api";
import SalesTable from "@/components/sales/SalesTable";

export default async function SalesListPage() {
  // Server-side data fetching
  const salesData = await getSales();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
        <Link 
          href="/sales/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Sale
        </Link>
      </div>

      <SalesTable initialSales={salesData} />
    </div>
  );
}