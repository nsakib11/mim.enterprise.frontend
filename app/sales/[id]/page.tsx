"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sales, Customer, Product, Employee, Inventory } from "@/utils/types";
import { getSale, getCustomers, getProducts, getEmployees, getInventories } from "@/utils/api";
import Link from "next/link";
export default function ViewSale() {
  const params = useParams();
  const saleId = Number(params.id);
  const [sale, setSale] = useState<Sales | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [saleData, customersData, productsData, employeesData, inventoriesData] = await Promise.all([
        getSale(saleId),
        getCustomers(),
        getProducts(),
        getEmployees(),
        getInventories()
      ]);
      setSale(saleData);
      setCustomers(customersData);
      setProducts(productsData);
      setEmployees(employeesData);
      setInventories(inventoriesData);
    };
    fetchData();
  }, [saleId]);

  if (!sale) return <div className="p-6 text-center text-gray-400">Loading...</div>;


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const masterInfoItems = [
    { label: "Invoice No", value: sale.invoiceNo },
    { label: "Customer", value: (sale.customerName) },
    { label: "Invoice Date", value: formatDate(sale.invoiceDate) },
    { label: "Delivery Token", value: sale.deliveryToken || "-" },
    { label: "Delivery Address", value: sale.deliveryAddress || "-" },
    { label: "Delivery Status", value: sale.deliveryStatus },
    { label: "Total Amount", value: `৳${sale.totalAmount?.toFixed(2)}` },
    { label: "Paid Amount", value: `৳${sale.paidAmount?.toFixed(2)}` },
    { label: "Due Amount", value: `৳${sale.dueAmount?.toFixed(2)}` },
    { label: "Payment Status", value: sale.paymentStatus },
    { label: "Payment Method", value: sale.paymentMethod },
    { label: "Sales Person", value: (sale.salesPersonName) },
    { label: "Inventory", value: (sale.inventoryName) },
    { label: "Return Valid Until", value: sale.returnValidUntil ? formatDate(sale.returnValidUntil) : "-" },
    { label: "Is Returned", value: sale.isReturned ? "Yes" : "No" },
  ];

  return (
     <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Sale Details</h1>
        <Link 
          href="/sales" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Go to List
        </Link>
      </div>
      {/* Master Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Master Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Sales Items */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sales Items</h2>
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center">Product</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-center">Delivered Qty</th>
              <th className="px-4 py-2 text-center">Pending Qty</th>
              <th className="px-4 py-2 text-center">Unit Price</th>
              <th className="px-4 py-2 text-center">Total Price</th>
              <th className="px-4 py-2 text-center">Category</th>
            </tr>
          </thead>
          <tbody>
            {sale.salesItems?.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{item.productName}</td>
                <td className="px-4 py-2 text-center">{item.quantity?.toString()}</td>
                <td className="px-4 py-2 text-center">{item.deliveredQuantity?.toString()}</td>
                <td className="px-4 py-2 text-center">{item.pendingQuantity?.toString()}</td>
                <td className="px-4 py-2 text-center">৳{item.unitPrice?.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">৳{item.totalPrice?.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">{item.productCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}