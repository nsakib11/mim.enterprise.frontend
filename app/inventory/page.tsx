"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inventory } from "@/utils/types";
import { getInventories, deleteInventory } from "@/utils/api";

export default function InventoryList() {
  const [inventories, setInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      const data = await getInventories();
      setInventories(data);
    };
    fetchInventories();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this inventory?")) {
      await deleteInventory(id);
      setInventories(prev => prev.filter(inventory => inventory.id !== id));
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventories</h1>
        <Link 
          href="/inventory/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Inventory
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
                Inventory Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
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
            {inventories.map(inventory => (
              <tr key={inventory.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inventory.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inventory.name}</div>
                  {inventory.nameBn && (
                    <div className="text-sm text-gray-500">{inventory.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {inventory.address || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {inventory.responsiblePerson || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inventory.mobile && (
                    <div className="text-sm text-gray-900">{inventory.mobile}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(inventory.active || false)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/inventory/${inventory.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/inventory/${inventory.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(inventory.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {inventories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No inventories found</p>
            <Link 
              href="/inventory/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first inventory
            </Link>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Inventories</h3>
          <p className="text-3xl font-bold text-blue-600">{inventories.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Inventories</h3>
          <p className="text-3xl font-bold text-green-600">
            {inventories.filter(inventory => inventory.active).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">With Contact Person</h3>
          <p className="text-3xl font-bold text-purple-600">
            {inventories.filter(inventory => inventory.responsiblePerson).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">With Mobile</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {inventories.filter(inventory => inventory.mobile).length}
          </p>
        </div>
      </div>
    </div>
  );
}