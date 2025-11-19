"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PurchaseResponse, Supplier, Product } from "@/utils/types";
import { getPurchase, getSuppliers, getProducts } from "@/utils/api";
import Link from "next/link";

export default function ViewPurchase() {
  const params = useParams();
  const purchaseId = Number(params.id);
  const [purchase, setPurchase] = useState<PurchaseResponse | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [purchaseData, suppliersData, productsData] = await Promise.all([
        getPurchase(purchaseId),
        getSuppliers(),
        getProducts()
      ]);
      setPurchase(purchaseData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    };
    fetchData();
  }, [purchaseId]);

  if (!purchase) return <div className="p-6 text-center text-gray-400">Loading...</div>;

  const getSupplierName = (supplierId?: number) => {
    if (!supplierId) return "-";
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : "-";
  };

  const getProductName = (productId?: number) => {
    if (!productId) return "-";
    const product = products.find(p => p.id === productId);
    return product ? product.name : "-";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return `৳${value.toFixed(2)}`;
  };

  const formatQuantity = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(2);
  };

  const masterInfoItems = [
    { label: "Purchase Order No", value: purchase.purchaseOrderNo },
    { label: "Supplier", value: purchase.supplierName || getSupplierName(purchase.supplierId) },
    { label: "Order Date", value: formatDate(purchase.orderDate) },
    { label: "Expected Delivery Date", value: purchase.expectedDeliveryDate ? formatDate(purchase.expectedDeliveryDate) : "-" },
    { label: "Quotation No", value: purchase.quotationNo || "-" },
    { label: "Supplier Invoice No", value: purchase.supplierInvoiceNo || "-" },
    { label: "Payment Type", value: purchase.paymentType },
    { label: "Total Amount", value: formatCurrency(purchase.totalAmount) },
    { label: "Paid Amount", value: formatCurrency(purchase.paidAmount) },
    { label: "Due Amount", value: formatCurrency(purchase.dueAmount) },
    { label: "Payment Status", value: purchase.paymentStatus },
    { label: "Delivery Status", value: purchase.deliveryStatus },
    { label: "Total Ordered Quantity", value: formatQuantity(purchase.totalOrderedQuantity) },
    { label: "Total Delivered Quantity", value: formatQuantity(purchase.totalDeliveredQuantity) },
    { label: "Total Pending Quantity", value: formatQuantity(purchase.totalPendingQuantity) },
    { label: "Price Locked", value: purchase.priceLocked ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Purchase Details</h1>
        <Link 
          href="/purchases" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Go to List
        </Link>
      </div>
      {/* Master Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Master Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterInfoItems.map(item => (
            <div
              key={item.label}
              className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
              <p className="text-gray-800 font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Items */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Purchase Items</h2>
        {purchase.purchaseItems && purchase.purchaseItems.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min Sales Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max Sales Price</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchase.purchaseItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName || getProductName(item.productId)}
                        </div>
                        {item.productId && (
                          <div className="text-sm text-gray-500">ID: {item.productId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatQuantity(item.orderedQuantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatQuantity(item.deliveredQuantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatQuantity(item.pendingQuantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(item.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(item.salesPriceMin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(item.salesPriceMax)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.productCategory || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No purchase items found</p>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Summary</h3>
          <p className="text-2xl font-bold text-blue-600">{formatQuantity(purchase.totalOrderedQuantity)}</p>
          <p className="text-sm text-blue-600">Total Ordered Quantity</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Delivery Progress</h3>
          <p className="text-2xl font-bold text-green-600">{formatQuantity(purchase.totalDeliveredQuantity)}</p>
          <p className="text-sm text-green-600">Total Delivered</p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-orange-600">{formatQuantity(purchase.totalPendingQuantity)}</p>
          <p className="text-sm text-orange-600">Remaining to Deliver</p>
        </div>
      </div>
    </div>
  );
}