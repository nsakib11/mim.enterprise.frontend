import Link from "next/link";
import { Inventory } from "@/utils/types";
import { getInventories } from "@/utils/api";
import InventoryTable from "@/components/inventory/InventoryTable";
import StatisticsCards from "@/components/inventory/StatisticsCards";

export default async function InventoryListPage() {
  // Server-side data fetching
  const inventoriesData = await getInventories();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventories</h1>
        <Link 
          href="/inventory/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Inventory
        </Link>
      </div>

      <InventoryTable initialInventories={inventoriesData} />
      <StatisticsCards inventories={inventoriesData} />
    </div>
  );
}