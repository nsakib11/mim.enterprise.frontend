
import Link from "next/link";
import { CostCenter } from "@/utils/types";
import { getCostCenters } from "@/utils/api";
import CostCenterTable from "@/components/cost-centers/CostCenterTable";
import StatisticsCards from "@/components/cost-centers/StatisticsCards";

export default async function CostCenterListPage() {
  // Server-side data fetching
  const costCentersData = await getCostCenters();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cost Centers</h1>
        <Link 
          href="/cost-center/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Cost Center
        </Link>
      </div>

      <CostCenterTable initialCostCenters={costCentersData} />
      <StatisticsCards costCenters={costCentersData} />
    </div>
  );
}