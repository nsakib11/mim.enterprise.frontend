import { Shop } from "@/utils/types";

interface StatisticsCardsProps {
  shops: Shop[];
}

export default function StatisticsCards({ shops }: StatisticsCardsProps) {
  const totalShops = shops.length;
  const activeShops = shops.filter(shop => shop.active).length;
  const totalMonthlyTarget = shops.reduce((sum, shop) => sum + (shop.monthlySalesTarget || 0), 0);
  const totalYearlyTarget = shops.reduce((sum, shop) => sum + (shop.yearlySalesTarget || 0), 0);
  const shopsWithMonthlyTarget = shops.filter(shop => shop.monthlySalesTarget).length;
  const shopsWithYearlyTarget = shops.filter(shop => shop.yearlySalesTarget).length;
  const shopsWithAddress = shops.filter(shop => shop.address).length;
  const shopsWithBanglaName = shops.filter(shop => shop.nameBn).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateAverages = () => {
    const avgMonthly = shops.length > 0 ? totalMonthlyTarget / shops.length : 0;
    const avgYearly = shops.length > 0 ? totalYearlyTarget / shops.length : 0;
    const avgMonthlyForShopsWithTarget = shopsWithMonthlyTarget > 0 ? totalMonthlyTarget / shopsWithMonthlyTarget : 0;
    const avgYearlyForShopsWithTarget = shopsWithYearlyTarget > 0 ? totalYearlyTarget / shopsWithYearlyTarget : 0;
    
    return {
      avgMonthly,
      avgYearly,
      avgMonthlyForShopsWithTarget,
      avgYearlyForShopsWithTarget
    };
  };

  const averages = calculateAverages();

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Shops</h3>
          <p className="text-3xl font-bold text-blue-600">{totalShops}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Shops</h3>
          <p className="text-3xl font-bold text-green-600">{activeShops}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Monthly Target</h3>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyTarget)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Yearly Target</h3>
          <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalYearlyTarget)}</p>
        </div>
      </div>

      {/* Target Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Target Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Monthly Targets</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Shops with Monthly Target</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{shopsWithMonthlyTarget}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({totalShops > 0 ? ((shopsWithMonthlyTarget / totalShops) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700">Average Monthly Target</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(averages.avgMonthlyForShopsWithTarget)}
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">Yearly Targets</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Shops with Yearly Target</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{shopsWithYearlyTarget}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({totalShops > 0 ? ((shopsWithYearlyTarget / totalShops) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700">Average Yearly Target</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(averages.avgYearlyForShopsWithTarget)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Shops with Address</span>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{shopsWithAddress}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalShops > 0 ? ((shopsWithAddress / totalShops) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Shops with Bangla Name</span>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{shopsWithBanglaName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalShops > 0 ? ((shopsWithBanglaName / totalShops) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Inactive Shops</span>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{totalShops - activeShops}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalShops > 0 ? (((totalShops - activeShops) / totalShops) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Comparison */}
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Target Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Monthly vs Yearly Target Ratio</div>
            <div className="text-xl font-bold text-blue-700">
              {totalYearlyTarget > 0 ? ((totalMonthlyTarget * 12 / totalYearlyTarget) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-500 mt-1">(Monthly×12) / Yearly</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Active Shops with Targets</div>
            <div className="text-xl font-bold text-green-700">
              {shops.filter(shop => shop.active && (shop.monthlySalesTarget || shop.yearlySalesTarget)).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Active shops with sales targets</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Complete Profiles</div>
            <div className="text-xl font-bold text-purple-700">
              {shops.filter(shop => 
                shop.name && 
                shop.address && 
                shop.monthlySalesTarget && 
                shop.yearlySalesTarget
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">All fields filled</div>
          </div>
        </div>
      </div>
    </div>
  );
}