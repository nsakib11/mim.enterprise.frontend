import Link from "next/link";
import { Shop } from "@/utils/types";
import { getShops } from "@/utils/api";
import ShopTable from "@/components/shops/ShopTable";
import StatisticsCards from "@/components/shops/StatisticsCards";

export default async function ShopListPage() {
  // Server-side data fetching
  const shopsData = await getShops();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shops</h1>
        <Link 
          href="/shops/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Shop
        </Link>
      </div>

      <ShopTable initialShops={shopsData} />
      <StatisticsCards shops={shopsData} />
    </div>
  );
}