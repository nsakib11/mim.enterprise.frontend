import { Supplier } from "@/utils/types";

interface StatisticsCardsProps {
  suppliers: Supplier[];
}

export default function StatisticsCards({ suppliers }: StatisticsCardsProps) {
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(supplier => supplier.isActive).length;
  
  // Count by product type
  const boardSuppliers = suppliers.filter(s => s.supplierProduct === 'BOARD').length;
  const hardwareSuppliers = suppliers.filter(s => s.supplierProduct === 'HARDWARE').length;
  const boardHardwareSuppliers = suppliers.filter(s => s.supplierProduct === 'BOARD_HARDWARE').length;
  
  // Count by supplier type
  const creditSuppliers = suppliers.filter(s => s.supplierType === 'CREDIT_PURCHASE').length;
  const nonCreditSuppliers = suppliers.filter(s => s.supplierType === 'NON_CREDIT_PURCHASE').length;
  
  // Contact info stats
  const suppliersWithBanglaName = suppliers.filter(s => s.nameBn).length;
  const suppliersWithTelephone = suppliers.filter(s => s.telephone).length;
  const suppliersWithEmail = suppliers.filter(s => s.email).length;
  const suppliersWithAddress = suppliers.filter(s => s.address).length;

  const getProductColor = (product: string) => {
    const colors = {
      "BOARD": "bg-orange-100",
      "HARDWARE": "bg-cyan-100",
      "BOARD_HARDWARE": "bg-indigo-100"
    };
    return colors[product as keyof typeof colors] || "bg-gray-100";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "CREDIT_PURCHASE": "bg-blue-100",
      "NON_CREDIT_PURCHASE": "bg-purple-100"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Suppliers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalSuppliers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Suppliers</h3>
          <p className="text-3xl font-bold text-green-600">{activeSuppliers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Credit Suppliers</h3>
          <p className="text-3xl font-bold text-purple-600">{creditSuppliers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Non-Credit Suppliers</h3>
          <p className="text-3xl font-bold text-indigo-600">{nonCreditSuppliers}</p>
        </div>
      </div> */}

      {/* Product & Type Distribution */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Type Distribution</h3>
          <div className="space-y-3">
            {['BOARD', 'HARDWARE', 'BOARD_HARDWARE'].map(product => {
              const count = suppliers.filter(s => s.supplierProduct === product).length;
              const percentage = totalSuppliers > 0 ? (count / totalSuppliers) * 100 : 0;
              
              return (
                <div key={product} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getProductColor(product)}`}></div>
                    <span className="text-sm text-gray-700">{product.replace(/_/g, ' ')}</span>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Type Distribution</h3>
          <div className="space-y-3">
            {['CREDIT_PURCHASE', 'NON_CREDIT_PURCHASE'].map(type => {
              const count = suppliers.filter(s => s.supplierType === type).length;
              const percentage = totalSuppliers > 0 ? (count / totalSuppliers) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getTypeColor(type)}`}></div>
                    <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
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
      </div>

      {/* Contact Information */}
      {/* <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">With Bangla Name</div>
            <div className="text-xl font-bold text-blue-700">{suppliersWithBanglaName}</div>
            <div className="text-xs text-gray-500 mt-1">
              ({totalSuppliers > 0 ? ((suppliersWithBanglaName / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">With Telephone</div>
            <div className="text-xl font-bold text-green-700">{suppliersWithTelephone}</div>
            <div className="text-xs text-gray-500 mt-1">
              ({totalSuppliers > 0 ? ((suppliersWithTelephone / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">With Email</div>
            <div className="text-xl font-bold text-purple-700">{suppliersWithEmail}</div>
            <div className="text-xs text-gray-500 mt-1">
              ({totalSuppliers > 0 ? ((suppliersWithEmail / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">With Address</div>
            <div className="text-xl font-bold text-indigo-700">{suppliersWithAddress}</div>
            <div className="text-xs text-gray-500 mt-1">
              ({totalSuppliers > 0 ? ((suppliersWithAddress / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
          </div>
        </div>
      </div> */}

      {/* Supplier Analysis */}
      {/* <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Board Suppliers</div>
            <div className="text-xl font-bold text-orange-700">
              {boardSuppliers} ({totalSuppliers > 0 ? ((boardSuppliers / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
            <div className="text-xs text-gray-500 mt-1">Specialized in board products</div>
          </div>
          
          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Hardware Suppliers</div>
            <div className="text-xl font-bold text-cyan-700">
              {hardwareSuppliers} ({totalSuppliers > 0 ? ((hardwareSuppliers / totalSuppliers) * 100).toFixed(1) : 0}%)
            </div>
            <div className="text-xs text-gray-500 mt-1">Specialized in hardware products</div>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Complete Profiles</div>
            <div className="text-xl font-bold text-indigo-700">
              {suppliers.filter(s => 
                s.name && 
                s.responsiblePerson && 
                s.mobile && 
                s.address
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">All contact fields filled</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}