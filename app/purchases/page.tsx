"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Purchase, PurchaseResponse, Supplier } from "@/utils/types";
import { getPurchases, deletePurchase, getSuppliers } from "@/utils/api";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [purchasesData, suppliersData] = await Promise.all([
        getPurchases(),
        getSuppliers()
      ]);
      
      // Transform PurchaseResponse to Purchase for display
      const transformedPurchases: Purchase[] = purchasesData.map((purchase: PurchaseResponse) => ({
        ...purchase,
        supplier: suppliersData.find(s => s.id === purchase.supplierId) || undefined
      }));
      
      setPurchases(transformedPurchases);
      setSuppliers(suppliersData);
    };
    
    fetchData();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this purchase?")) {
      await deletePurchase(id);
      setPurchases(prev => prev.filter(purchase => purchase.id !== id));
    }
  };

  const getSupplierName = (purchase: Purchase) => {
    // Try supplier name from response first, then fallback to supplier object
    if ((purchase as PurchaseResponse).supplierName) {
      return (purchase as PurchaseResponse).supplierName;
    }
    return purchase.supplier?.name || "-";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount?.toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PAID: "bg-green-100 text-green-800",
      PARTIAL: "bg-yellow-100 text-yellow-800",
      DUE: "bg-red-100 text-red-800",
      PENDING: "bg-gray-100 text-gray-800",
      COMPLETED: "bg-blue-100 text-blue-800"
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchases</h1>
        <Link 
          href="/purchases/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Purchase
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Delivery
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map(purchase => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {purchase.purchaseOrderNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getSupplierName(purchase)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(purchase.orderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(purchase.expectedDeliveryDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                  {formatCurrency(purchase.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(purchase.paymentStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(purchase.deliveryStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/purchases/${purchase.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/purchases/${purchase.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(purchase.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {purchases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No purchases found</p>
            <Link 
              href="/purchases/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Create your first purchase
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}