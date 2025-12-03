import Link from "next/link";
import { Unit } from "@/utils/types";
import { getUnits } from "@/utils/api";
import UnitTable from "@/components/units/UnitTable";
import StatisticsCards from "@/components/units/StatisticsCards";

export default async function UnitListPage() {
  // Server-side data fetching
  const unitsData = await getUnits();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Units</h1>
        <Link 
          href="/units/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Unit
        </Link>
      </div>

      <UnitTable initialUnits={unitsData} />
      <StatisticsCards units={unitsData} />
    </div>
  );
}