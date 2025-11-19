"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Supplier } from "@/utils/types";
import { getSuppliers, deleteSupplier } from "@/utils/api";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const data = await getSuppliers();
      setSuppliers(data);
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const statusColors = {
      true: "bg-green-100 text-green-800",
      false: "bg-red-100 text-red-800"
    };
    
    const colorClass = statusColors[isActive.toString() as keyof typeof statusColors];
    const statusText = isActive ? "Active" : "Inactive";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      "CREDIT_PURCHASE": "bg-blue-100 text-blue-800",
      "NON_CREDIT_PURCHASE": "bg-purple-100 text-purple-800"
    };
    
    const colorClass = typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  const getProductBadge = (product: string) => {
    const productColors = {
      "BOARD": "bg-orange-100 text-orange-800",
      "HARDWARE": "bg-cyan-100 text-cyan-800",
      "BOARD_HARDWARE": "bg-indigo-100 text-indigo-800"
    };
    
    const colorClass = productColors[product as keyof typeof productColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {product.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <Link 
          href="/suppliers/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Supplier
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
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
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
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{supplier.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                  {supplier.nameBn && (
                    <div className="text-sm text-gray-500">{supplier.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getProductBadge(supplier.supplierProduct)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTypeBadge(supplier.supplierType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.responsiblePerson}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.mobile}</div>
                  {supplier.telephone && (
                    <div className="text-sm text-gray-500">{supplier.telephone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(supplier.isActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/suppliers/${supplier.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/suppliers/${supplier.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(supplier.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {suppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No suppliers found</p>
            <Link 
              href="/suppliers/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first supplier
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}