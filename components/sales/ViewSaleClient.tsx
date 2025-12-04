"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sales, Customer, Product, Employee, Inventory } from "@/utils/types";
import { getSale, getCustomers, getProducts, getEmployees, getInventories } from "@/utils/api";
import Link from "next/link";

interface ViewSaleClientProps {
  initialSale: Sales;
  initialCustomers: Customer[];
  initialProducts: Product[];
  initialEmployees: Employee[];
  initialInventories: Inventory[];
}

export default function ViewSaleClient({ 
  initialSale, 
  initialCustomers,
  initialProducts,
  initialEmployees,
  initialInventories
}: ViewSaleClientProps) {
  const params = useParams();
  const router = useRouter();
  const saleId = Number(params.id);
  const [sale, setSale] = useState<Sales | null>(initialSale);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [inventories, setInventories] = useState<Inventory[]>(initialInventories);
  const [loading, setLoading] = useState(!initialSale);

  useEffect(() => {
    const shouldRefetch = !initialSale || initialSale.id !== saleId;
    
    if (shouldRefetch) {
      const fetchData = async () => {
        setLoading(true);
        try {
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
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [saleId, initialSale]);

  const handleEdit = () => {
    router.push(`/sales/${saleId}/edit`);
  };

  if (loading || !sale) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const masterInfoItems = [
    { label: "Invoice No", value: sale.invoiceNo },
    { label: "Customer", value: sale.customerName || "-" },
    { label: "Invoice Date", value: formatDate(sale.invoiceDate) },
    { label: "Delivery Token", value: sale.deliveryToken || "-" },
    { label: "Delivery Address", value: sale.deliveryAddress || "-" },
    { label: "Delivery Status", value: sale.deliveryStatus },
    { label: "Total Amount", value: `৳${sale.totalAmount?.toFixed(2) || "0.00"}` },
    { label: "Paid Amount", value: `৳${sale.paidAmount?.toFixed(2) || "0.00"}` },
    { label: "Due Amount", value: `৳${sale.dueAmount?.toFixed(2) || "0.00"}` },
    { label: "Payment Status", value: sale.paymentStatus },
    { label: "Payment Method", value: sale.paymentMethod },
    { label: "Sales Person", value: sale.salesPersonName || "-" },
    { label: "Inventory", value: sale.inventoryName || "-" },
    { label: "Return Valid Until", value: sale.returnValidUntil ? formatDate(sale.returnValidUntil) : "-" },
    { label: "Is Returned", value: sale.isReturned ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Sale Details</h1>
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <Link 
            href="/sales" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      {/* Master Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sale Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {masterInfoItems.map(item => (
            <div
              key={item.label}
              className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
              <p className="text-gray-800 font-semibold mt-1 text-lg">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Items</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Delivered Qty</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Pending Qty</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sale.salesItems?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.productName || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {item.quantity?.toString() || "0"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {item.deliveredQuantity?.toString() || "0"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {item.pendingQuantity?.toString() || "0"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    ৳{item.unitPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    ৳{item.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {item.productCategory || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Amount</h3>
          <p className="text-3xl font-bold text-blue-600">৳{sale.totalAmount?.toFixed(2) || "0.00"}</p>
          <p className="text-sm text-blue-600">Gross Sale Value</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Status</h3>
          <p className="text-3xl font-bold text-green-600">{sale.paymentStatus}</p>
          <p className="text-sm text-green-600">
            {sale.dueAmount && sale.dueAmount > 0 
              ? `৳${sale.dueAmount.toFixed(2)} due` 
              : "Fully Paid"}
          </p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Delivery Status</h3>
          <p className="text-3xl font-bold text-orange-600">{sale.deliveryStatus}</p>
          <p className="text-sm text-orange-600">
            {sale.salesItems?.some(item => item.pendingQuantity && item.pendingQuantity > 0) 
              ? "Partially Delivered" 
              : "Fully Delivered"}
          </p>
        </div>
      </div>
    </div>
  );
}