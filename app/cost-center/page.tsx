"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CostCenter, CostCenterType } from "@/utils/types";
import { getCostCenters, deleteCostCenter } from "@/utils/api";

export default function CostCenterList() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);

  useEffect(() => {
    const fetchCostCenters = async () => {
      const data = await getCostCenters();
      setCostCenters(data);
    };

    fetchCostCenters();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this cost center?")) {
      await deleteCostCenter(id);
      setCostCenters(prev => prev.filter(cc => cc.id !== id));
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

  const getTypeBadge = (type: CostCenterType) => {
    const typeColors = {
      [CostCenterType.SHOP]: "bg-blue-100 text-blue-800",
      [CostCenterType.OFFICE]: "bg-purple-100 text-purple-800",
      [CostCenterType.INVENTORY]: "bg-orange-100 text-orange-800",
      [CostCenterType.GENERAL]: "bg-gray-100 text-gray-800"
    };
    
    const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cost Centers</h1>
        <Link 
          href="/cost-center/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Cost Center
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
                Cost Center Details
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {costCenters.map(cc => (
              <tr key={cc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cc.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cc.name}</div>
                  {cc.nameBn && (
                    <div className="text-sm text-gray-500">{cc.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTypeBadge(cc.costCenterType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(cc.active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/cost-center/${cc.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/cost-center/${cc.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(cc.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {costCenters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No cost centers found</p>
            <Link 
              href="/cost-center/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first cost center
            </Link>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Cost Centers</h3>
          <p className="text-3xl font-bold text-blue-600">{costCenters.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Cost Centers</h3>
          <p className="text-3xl font-bold text-green-600">
            {costCenters.filter(cc => cc.active).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Shop Centers</h3>
          <p className="text-3xl font-bold text-purple-600">
            {costCenters.filter(cc => cc.costCenterType === CostCenterType.SHOP).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Centers</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {costCenters.filter(cc => cc.costCenterType === CostCenterType.OFFICE).length}
          </p>
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
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getTypeBadge(type).props.className.split(' ')[1]}`}></div>
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
                <span className="text-sm font-medium text-gray-900">
                  {costCenters.filter(cc => cc.active).length}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({costCenters.length > 0 ? ((costCenters.filter(cc => cc.active).length / costCenters.length) * 100).toFixed(1) : 0}%)
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
    </div>
  );
}