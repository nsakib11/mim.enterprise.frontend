import { CostCenter, CostCenterType } from "@/utils/types";

interface StatisticsCardsProps {
  costCenters: CostCenter[];
}

export default function StatisticsCards({ costCenters }: StatisticsCardsProps) {
  const totalCostCenters = costCenters.length;
  const activeCostCenters = costCenters.filter(cc => cc.active).length;
  const shopCenters = costCenters.filter(cc => cc.costCenterType === CostCenterType.SHOP).length;
  const officeCenters = costCenters.filter(cc => cc.costCenterType === CostCenterType.OFFICE).length;

  const getTypeBadgeColor = (type: CostCenterType) => {
    const typeColors = {
      [CostCenterType.SHOP]: "bg-blue-100 text-blue-800",
      [CostCenterType.OFFICE]: "bg-purple-100 text-purple-800",
      [CostCenterType.INVENTORY]: "bg-orange-100 text-orange-800",
      [CostCenterType.GENERAL]: "bg-gray-100 text-gray-800"
    };
    return typeColors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Cost Centers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCostCenters}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Cost Centers</h3>
          <p className="text-3xl font-bold text-green-600">{activeCostCenters}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Shop Centers</h3>
          <p className="text-3xl font-bold text-purple-600">{shopCenters}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Centers</h3>
          <p className="text-3xl font-bold text-indigo-600">{officeCenters}</p>
        </div>
      </div>

      {/* Type Distribution Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Center Types</h3>
          <div className="space-y-3">
            {Object.values(CostCenterType).map(type => {
              const count = costCenters.filter(cc => cc.costCenterType === type).length;
              const percentage = costCenters.length > 0 ? (count / costCenters.length) * 100 : 0;
              const colorClass = getTypeBadgeColor(type);
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${colorClass.split(' ')[1]}`}></div>
                    <span className="text-sm text-gray-700">{type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{activeCostCenters}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({costCenters.length > 0 ? ((activeCostCenters / costCenters.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
                <span className="text-sm text-gray-700">Inactive</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {costCenters.filter(cc => !cc.active).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({costCenters.length > 0 ? ((costCenters.filter(cc => !cc.active).length / costCenters.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}