import { Product } from "@/utils/types";

interface StatisticsCardsProps {
  products: Product[];
}

export default function StatisticsCards({ products }: StatisticsCardsProps) {
  const totalProducts = products.length;
  const activeProducts = products.filter(product => product.active).length;
  const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean)).size;
  const uniqueSuppliers = new Set(products.map(p => p.supplier?.id).filter(Boolean)).size;
  const uniqueUnits = new Set(products.map(p => p.unit?.id).filter(Boolean)).size;
  const productsWithBanglaName = products.filter(product => product.nameBn).length;

  const getCategoryColor = (category?: string) => {
    const colors = {
      "Building Material": "bg-blue-100",
      "Hardware": "bg-orange-100",
      "Board": "bg-green-100",
      "Electrical": "bg-purple-100",
      "Plumbing": "bg-cyan-100"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-green-600">{activeProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">{uniqueCategories}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Suppliers</h3>
          <p className="text-3xl font-bold text-indigo-600">{uniqueSuppliers}</p>
        </div>
      </div> */}

      {/* Distribution Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {/* Get all unique categories */}
            {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => {
              const count = products.filter(product => product.category === category).length;
              const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getCategoryColor(category)}`}></div>
                    <span className="text-sm text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
            {/* Products without category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3 bg-gray-100"></div>
                <span className="text-sm text-gray-700">No Category</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {products.filter(product => !product.category).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalProducts > 0 ? ((products.filter(product => !product.category).length / totalProducts) * 100).toFixed(1) : 0}%)
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
                <span className="text-sm font-medium text-gray-900">{activeProducts}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(1) : 0}%)
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
                  {products.filter(product => !product.active).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({totalProducts > 0 ? ((products.filter(product => !product.active).length / totalProducts) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Additional Stats</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Products with Bangla Name</span>
                <span className="text-sm font-medium text-gray-900">
                  {productsWithBanglaName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Products without Supplier</span>
                <span className="text-sm font-medium text-gray-900">
                  {products.filter(product => !product.supplier).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Products without Unit</span>
                <span className="text-sm font-medium text-gray-900">
                  {products.filter(product => !product.unit).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Complete Profiles</div>
            <div className="text-xl font-bold text-blue-700">
              {products.filter(product => 
                product.name && 
                product.category && 
                product.supplier && 
                product.unit
              ).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">All fields filled</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Products with Units</div>
            <div className="text-xl font-bold text-green-700">
              {products.filter(product => product.unit).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Has unit defined</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Products with Suppliers</div>
            <div className="text-xl font-bold text-purple-700">
              {products.filter(product => product.supplier).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Has supplier assigned</div>
          </div>
        </div>
      </div>
    </div>
  );
}