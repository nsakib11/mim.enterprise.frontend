"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shop } from "@/utils/types";
import { getShops, deleteShop } from "@/utils/api";

export default function ShopList() {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      const data = await getShops();
      setShops(data);
    };
    fetchShops();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this shop?")) {
      await deleteShop(id);
      setShops(prev => prev.filter(shop => shop.id !== id));
    }
  };

  const getStatusBadge = (active: boolean) => {
    const statusColors = {
      true: "bg-green-100 text-green-800",
      false: "bg-red-100 text-red-800"
    };
    
    const colorClass = statusColors[active.toString() as keyof typeof statusColors];
    const statusText = active ? "Active" : "Inactive";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {statusText}
      </span>
    );
  };

 const formatCurrency = (amount?: number) => {
  if (!amount) return "-";
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(amount);
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shops</h1>
        <Link 
          href="/shops/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Shop
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Target
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yearly Target
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shops.map(shop => (
              <tr key={shop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shop.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                  {shop.nameBn && (
                    <div className="text-sm text-gray-500">{shop.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {shop.address || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(shop.monthlySalesTarget)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(shop.yearlySalesTarget)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(shop.active || false)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/shops/${shop.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/shops/${shop.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(shop.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {shops.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No shops found</p>
            <Link 
              href="/shops/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first shop
            </Link>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Shops</h3>
          <p className="text-3xl font-bold text-blue-600">{shops.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Shops</h3>
          <p className="text-3xl font-bold text-green-600">
            {shops.filter(shop => shop.active).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Monthly Target</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(shops.reduce((sum, shop) => sum + (shop.monthlySalesTarget || 0), 0))}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Yearly Target</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(shops.reduce((sum, shop) => sum + (shop.yearlySalesTarget || 0), 0))}
          </p>
        </div>
      </div>
    </div>
  );
}