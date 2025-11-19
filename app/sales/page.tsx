"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sales } from "@/utils/types";
import { getSales, deleteSale } from "@/utils/api";

export default function SalesList() {
  const [sales, setSales] = useState<Sales[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      const data = await getSales();
      setSales(data);
    };

    fetchSales();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this sale?")) {
      await deleteSale(id);
      setSales(prev => prev.filter(sale => sale.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      'PAID': "bg-green-100 text-green-800",
      'PARTIAL': "bg-yellow-100 text-yellow-800",
      'UNPAID': "bg-red-100 text-red-800"
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  const getDeliveryStatusBadge = (status: string) => {
    const statusColors = {
      'COMPLETED': "bg-green-100 text-green-800",
      'PARTIAL': "bg-yellow-100 text-yellow-800",
      'PENDING': "bg-gray-100 text-gray-800"
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
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
        <Link 
          href="/sales/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Sale
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Amount
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
            {sales.map(sale => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sale.invoiceNo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.customerName || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(sale.invoiceDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ৳{sale.totalAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ৳{sale.paidAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ৳{sale.dueAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getPaymentStatusBadge(sale.paymentStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getDeliveryStatusBadge(sale.deliveryStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/sales/${sale.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/sales/${sale.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(sale.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sales.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No sales found</p>
            <Link 
              href="/sales/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Create your first sale
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}