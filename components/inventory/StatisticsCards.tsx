import { Inventory } from "@/utils/types";

interface StatisticsCardsProps {
  inventories: Inventory[];
}

export default function StatisticsCards({ inventories }: StatisticsCardsProps) {
  const totalInventories = inventories.length;
  const activeInventories = inventories.filter(inventory => inventory.active).length;
  const inventoriesWithContactPerson = inventories.filter(inventory => inventory.responsiblePerson).length;
  const inventoriesWithMobile = inventories.filter(inventory => inventory.mobile).length;
  const inactiveInventories = inventories.filter(inventory => !inventory.active).length;

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      

      {/* Detailed Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
           
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">With Address</span>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {inventories.filter(inventory => inventory.address).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalInventories > 0 ? ((inventories.filter(inventory => inventory.address).length / totalInventories) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">With Bangla Name</span>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {inventories.filter(inventory => inventory.nameBn).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalInventories > 0 ? ((inventories.filter(inventory => inventory.nameBn).length / totalInventories) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
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
                <span className="text-sm font-medium text-gray-900">{activeInventories}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalInventories > 0 ? ((activeInventories / totalInventories) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
                <span className="text-sm text-gray-700">Inactive</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{inactiveInventories}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalInventories > 0 ? ((inactiveInventories / totalInventories) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Complete Profiles</div>
            <div className="text-xl font-bold text-blue-700">
              {inventories.filter(inv => 
                inv.name && 
                inv.address && 
                inv.responsiblePerson && 
                inv.mobile
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">All fields filled</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Basic Profiles</div>
            <div className="text-xl font-bold text-green-700">
              {inventories.filter(inv => 
                inv.name && 
                inv.address
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Name & Address only</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Contact Information</div>
            <div className="text-xl font-bold text-purple-700">
              {inventories.filter(inv => 
                inv.mobile
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Has contact info</div>
          </div>
        </div>
      </div>
    </div>
  );
}