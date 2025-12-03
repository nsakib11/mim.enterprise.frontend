
import Link from "next/link";
import { Bank } from "@/utils/types";
import { getBanks } from "@/utils/api";
import BankTable from "@/components/banks/BankTable";
import StatisticsCards from "@/components/banks/StatisticsCards";

export default async function BankListPage() {
  // Server-side data fetching
  const banksData = await getBanks();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banks</h1>
        <Link 
          href="/banks/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Bank
        </Link>
      </div>

      <BankTable initialBanks={banksData} />
      <StatisticsCards banks={banksData} />
    </div>
  );
}