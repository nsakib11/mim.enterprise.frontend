import { Customer, CustomerType } from "@/utils/types";

interface StatisticsCardsProps {
  customers: Customer[];
}

export default function StatisticsCards({ customers }: StatisticsCardsProps) {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => customer.active).length;
  const individualCustomers = customers.filter(customer => customer.customerType === CustomerType.INDIVIDUAL).length;
  const partyCustomers = customers.filter(customer => customer.customerType === CustomerType.PARTY).length;

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Individual</h3>
          <p className="text-3xl font-bold text-purple-600">{individualCustomers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Party</h3>
          <p className="text-3xl font-bold text-indigo-600">{partyCustomers}</p>
        </div>
      </div> */}

      {/* Type Distribution Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Types</h3>
          <div className="space-y-3">
            {Object.values(CustomerType).map(type => {
              const count = customers.filter(customer => customer.customerType === type).length;
              const percentage = customers.length > 0 ? (count / customers.length) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      type === CustomerType.INDIVIDUAL ? 'bg-blue-100' : 'bg-purple-100'
                    }`}></div>
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
                <span className="text-sm font-medium text-gray-900">{activeCustomers}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({customers.length > 0 ? ((activeCustomers / customers.length) * 100).toFixed(1) : 0}%)
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
                  {customers.filter(customer => !customer.active).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({customers.length > 0 ? ((customers.filter(customer => !customer.active).length / customers.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}