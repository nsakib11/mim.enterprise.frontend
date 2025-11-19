"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/utils/types";
import { getProducts, deleteProduct } from "@/utils/api";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
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

  const getCategoryBadge = (category?: string) => {
    if (!category) return "-";
    
    const categoryColors = {
      "Building Material": "bg-blue-100 text-blue-800",
      "Hardware": "bg-orange-100 text-orange-800",
      "Board": "bg-green-100 text-green-800",
      "Electrical": "bg-purple-100 text-purple-800",
      "Plumbing": "bg-cyan-100 text-cyan-800"
    };
    
    const colorClass = categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link 
          href="/products/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Product
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
                Product Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
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
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  {product.nameBn && (
                    <div className="text-sm text-gray-500">{product.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(product.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.supplier?.name || "-"}
                  </div>
                  {product.supplier?.code && (
                    <div className="text-sm text-gray-500">{product.supplier.code}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.unit?.name || "-"}
                  </div>
                  {product.unit?.nameBn && (
                    <div className="text-sm text-gray-500">{product.unit.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(product.active || false)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/products/${product.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/products/${product.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No products found</p>
            <Link 
              href="/products/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first product
            </Link>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(product => product.active).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(products.map(p => p.category).filter(Boolean)).size}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Suppliers</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {new Set(products.map(p => p.supplier?.id).filter(Boolean)).size}
          </p>
        </div>
      </div>
    </div>
  );
}