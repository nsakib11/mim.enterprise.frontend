
import Link from "next/link";
import { BankBranch, Bank } from "@/utils/types";
import { getBankBranches, getBanks } from "@/utils/api";
import BankBranchTable from "@/components/bank-branches/BankBranchTable";
import StatisticsCards from "@/components/bank-branches/StatisticsCards";

export default async function BankBranchListPage() {
  // Server-side data fetching
  const [branchesData, banksData] = await Promise.all([
    getBankBranches(),
    getBanks()
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bank Branches</h1>
        <Link 
          href="/bank-branches/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Bank Branch
        </Link>
      </div>

      <BankBranchTable 
        initialBranches={branchesData} 
        initialBanks={banksData} 
      />
      
      <StatisticsCards branches={branchesData} />
    </div>
  );
}