import { Bank } from "@/utils/types";

interface StatisticsCardsProps {
  banks: Bank[];
}

export default function StatisticsCards({ banks }: StatisticsCardsProps) {
  const totalBanks = banks.length;
  const activeBanks = banks.filter(bank => bank.active).length;
  const banksWithWebsite = banks.filter(bank => bank.website).length;
  const inactiveBanks = banks.filter(bank => !bank.active).length;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Banks</h3>
        <p className="text-3xl font-bold text-blue-600">{totalBanks}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Banks</h3>
        <p className="text-3xl font-bold text-green-600">{activeBanks}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Banks with Website</h3>
        <p className="text-3xl font-bold text-purple-600">{banksWithWebsite}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Inactive Banks</h3>
        <p className="text-3xl font-bold text-red-600">{inactiveBanks}</p>
      </div>
    </div>
  );
}