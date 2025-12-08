"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PurchaseResponse, Supplier, Product } from "@/utils/types";
import { getPurchase, getSuppliers, getProducts, downloadPurchaseInvoice } from "@/utils/api";
import Link from "next/link";

type FormatType = "pdf" | "word" | "excel";

interface ViewPurchaseClientProps {
  initialPurchase: PurchaseResponse;
  initialSuppliers: Supplier[];
  initialProducts: Product[];
}

export default function ViewPurchaseClient({ 
  initialPurchase, 
  initialSuppliers,
  initialProducts
}: ViewPurchaseClientProps) {
  const params = useParams();
  const router = useRouter();
  const purchaseId = Number(params.id);
  const [purchase, setPurchase] = useState<PurchaseResponse | null>(initialPurchase);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(!initialPurchase);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string>("");

  useEffect(() => {
    const shouldRefetch = !initialPurchase || initialPurchase.id !== purchaseId;
    
    if (shouldRefetch) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [purchaseData, suppliersData, productsData] = await Promise.all([
            getPurchase(purchaseId),
            getSuppliers(),
            getProducts()
          ]);
          setPurchase(purchaseData);
          setSuppliers(suppliersData);
          setProducts(productsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [purchaseId, initialPurchase]);

  const handleEdit = () => {
    router.push(`/purchases/${purchaseId}/edit`);
  };

  const generateInvoice = async (format: FormatType = "pdf") => {
    if (!purchase || !purchase.id) {
      setInvoiceError("Purchase information is incomplete");
      return;
    }
  
    try {
      setGeneratingInvoice(true);
      setInvoiceError("");
  
      await downloadPurchaseInvoice(purchase.id, format);
  
      console.log("Invoice downloaded successfully");
    } catch (err: any) {
      console.error("Error generating invoice:", err);
  
      if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
        setInvoiceError(
          "Cannot connect to the server. Please make sure the Spring Boot backend is running on http://localhost:8080"
        );
      } else if (err.response) {
        setInvoiceError(
          `Server error: ${err.response.status} - ${err.response.statusText}`
        );
      } else if (err.request) {
        setInvoiceError(
          "No response from server. Please check if the backend is running."
        );
      } else {
        setInvoiceError(`Failed to generate invoice: ${err.message}`);
      }
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // Handler for the main generate button (defaults to PDF)
  const handleGenerateInvoice = () => {
    generateInvoice("pdf");
  };

  if (loading || !purchase) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

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
    <div className="p-6 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Purchase Details</h1>
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
            href="/purchases" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      {/* Master Information - Full width grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Master Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {masterInfoItems.map(item => (
            <div
              key={item.label}
              className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
              <p className="text-gray-800 font-semibold mt-1 text-lg">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Items - Full width table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Purchase Items</h2>
        {purchase.purchaseItems && purchase.purchaseItems.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Ordered Qty</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Delivered Qty</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Pending Qty</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Purchase Price</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Min Sales Price</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Max Sales Price</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchase.purchaseItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName || getProductName(item.productId)}
                        </div>
                        {item.productId && (
                          <div className="text-sm text-gray-500">ID: {item.productId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatQuantity(item.orderedQuantity)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatQuantity(item.deliveredQuantity)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatQuantity(item.pendingQuantity)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatCurrency(item.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatCurrency(item.salesPriceMin)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {formatCurrency(item.salesPriceMax)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      {item.productCategory || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No purchase items found</p>
          </div>
        )}
      </div>

      {/* Summary Section - Full width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Summary</h3>
          <p className="text-3xl font-bold text-blue-600">{formatQuantity(purchase.totalOrderedQuantity)}</p>
          <p className="text-sm text-blue-600">Total Ordered Quantity</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Delivery Progress</h3>
          <p className="text-3xl font-bold text-green-600">{formatQuantity(purchase.totalDeliveredQuantity)}</p>
          <p className="text-sm text-green-600">Total Delivered</p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-orange-600">{formatQuantity(purchase.totalPendingQuantity)}</p>
          <p className="text-sm text-orange-600">Remaining to Deliver</p>
        </div>
      </div>

      {/* Invoice Generation Section */}
      <div className="mt-10">
        {invoiceError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm font-medium">Invoice Error:</p>
            <p className="text-red-700 text-sm mt-1">{invoiceError}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Invoice Generation</h3>
            <p className="text-sm text-gray-600">Generate invoice for purchase order: {purchase.purchaseOrderNo}</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {/* Format selection dropdown (optional) */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-l px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={generatingInvoice}
              >
                <option value="pdf">PDF Format</option>
                {/* <option value="word">Word Document</option>
                <option value="excel">Excel Spreadsheet</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            {/* Generate Invoice Button */}
            <button
              onClick={handleGenerateInvoice}
              disabled={generatingInvoice}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingInvoice ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { PurchaseResponse, Supplier, Product } from "@/utils/types";
// import { getPurchase, getSuppliers, getProducts } from "@/utils/api";
// import Link from "next/link";

// interface ViewPurchaseClientProps {
//   initialPurchase: PurchaseResponse;
//   initialSuppliers: Supplier[];
//   initialProducts: Product[];
// }

// export default function ViewPurchaseClient({ 
//   initialPurchase, 
//   initialSuppliers,
//   initialProducts
// }: ViewPurchaseClientProps) {
//   const params = useParams();
//   const router = useRouter();
//   const purchaseId = Number(params.id);
//   const [purchase, setPurchase] = useState<PurchaseResponse | null>(initialPurchase);
//   const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
//   const [products, setProducts] = useState<Product[]>(initialProducts);
//   const [loading, setLoading] = useState(!initialPurchase);

//   useEffect(() => {
//     const shouldRefetch = !initialPurchase || initialPurchase.id !== purchaseId;
    
//     if (shouldRefetch) {
//       const fetchData = async () => {
//         setLoading(true);
//         try {
//           const [purchaseData, suppliersData, productsData] = await Promise.all([
//             getPurchase(purchaseId),
//             getSuppliers(),
//             getProducts()
//           ]);
//           setPurchase(purchaseData);
//           setSuppliers(suppliersData);
//           setProducts(productsData);
//         } catch (error) {
//           console.error("Failed to fetch data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [purchaseId, initialPurchase]);

//   const handleEdit = () => {
//     router.push(`/purchases/${purchaseId}/edit`);
//   };

//   if (loading || !purchase) {
//     return <div className="p-6 text-center text-gray-400">Loading...</div>;
//   }

//   const getSupplierName = (supplierId?: number) => {
//     if (!supplierId) return "-";
//     const supplier = suppliers.find(s => s.id === supplierId);
//     return supplier ? supplier.name : "-";
//   };

//   const getProductName = (productId?: number) => {
//     if (!productId) return "-";
//     const product = products.find(p => p.id === productId);
//     return product ? product.name : "-";
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatCurrency = (value: number | null) => {
//     if (value === null || value === undefined) return "-";
//     return `৳${value.toFixed(2)}`;
//   };

//   const formatQuantity = (value: number | null) => {
//     if (value === null || value === undefined) return "-";
//     return value.toFixed(2);
//   };

//   const masterInfoItems = [
//     { label: "Purchase Order No", value: purchase.purchaseOrderNo },
//     { label: "Supplier", value: purchase.supplierName || getSupplierName(purchase.supplierId) },
//     { label: "Order Date", value: formatDate(purchase.orderDate) },
//     { label: "Expected Delivery Date", value: purchase.expectedDeliveryDate ? formatDate(purchase.expectedDeliveryDate) : "-" },
//     { label: "Quotation No", value: purchase.quotationNo || "-" },
//     { label: "Supplier Invoice No", value: purchase.supplierInvoiceNo || "-" },
//     { label: "Payment Type", value: purchase.paymentType },
//     { label: "Total Amount", value: formatCurrency(purchase.totalAmount) },
//     { label: "Paid Amount", value: formatCurrency(purchase.paidAmount) },
//     { label: "Due Amount", value: formatCurrency(purchase.dueAmount) },
//     { label: "Payment Status", value: purchase.paymentStatus },
//     { label: "Delivery Status", value: purchase.deliveryStatus },
//     { label: "Total Ordered Quantity", value: formatQuantity(purchase.totalOrderedQuantity) },
//     { label: "Total Delivered Quantity", value: formatQuantity(purchase.totalDeliveredQuantity) },
//     { label: "Total Pending Quantity", value: formatQuantity(purchase.totalPendingQuantity) },
//     { label: "Price Locked", value: purchase.priceLocked ? "Yes" : "No" },
//   ];

//   return (
//     <div className="p-6 mx-auto">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-indigo-700">Purchase Details</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={handleEdit}
//             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200 flex items-center gap-2"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//             </svg>
//             Edit
//           </button>
//           <Link 
//             href="/purchases" 
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
//           >
//             Back to List
//           </Link>
//         </div>
//       </div>
      
//       {/* Master Information - Full width grid */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">Master Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {masterInfoItems.map(item => (
//             <div
//               key={item.label}
//               className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm"
//             >
//               <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
//               <p className="text-gray-800 font-semibold mt-1 text-lg">{item.value || "-"}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Purchase Items - Full width table */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">Purchase Items</h2>
//         {purchase.purchaseItems && purchase.purchaseItems.length > 0 ? (
//           <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase">Product</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Ordered Qty</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Delivered Qty</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Pending Qty</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Purchase Price</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Min Sales Price</th>
//                   <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase">Max Sales Price</th>
//                   <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase">Category</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {purchase.purchaseItems.map((item, index) => (
//                   <tr key={item.id || index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {item.productName || getProductName(item.productId)}
//                         </div>
//                         {item.productId && (
//                           <div className="text-sm text-gray-500">ID: {item.productId}</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatQuantity(item.orderedQuantity)}
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatQuantity(item.deliveredQuantity)}
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatQuantity(item.pendingQuantity)}
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatCurrency(item.purchasePrice)}
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatCurrency(item.salesPriceMin)}
//                     </td>
//                     <td className="px-6 py-4 text-right font-medium text-gray-900">
//                       {formatCurrency(item.salesPriceMax)}
//                     </td>
//                     <td className="px-6 py-4 text-center font-medium text-gray-900">
//                       {item.productCategory || "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
//             <p className="text-gray-500 text-lg">No purchase items found</p>
//           </div>
//         )}
//       </div>

//       {/* Summary Section - Full width */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//           <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Summary</h3>
//           <p className="text-3xl font-bold text-blue-600">{formatQuantity(purchase.totalOrderedQuantity)}</p>
//           <p className="text-sm text-blue-600">Total Ordered Quantity</p>
//         </div>
        
//         <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">Delivery Progress</h3>
//           <p className="text-3xl font-bold text-green-600">{formatQuantity(purchase.totalDeliveredQuantity)}</p>
//           <p className="text-sm text-green-600">Total Delivered</p>
//         </div>
        
//         <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
//           <h3 className="text-lg font-semibold text-orange-800 mb-2">Pending</h3>
//           <p className="text-3xl font-bold text-orange-600">{formatQuantity(purchase.totalPendingQuantity)}</p>
//           <p className="text-sm text-orange-600">Remaining to Deliver</p>
//         </div>
//       </div>
//       <div className="flex justify-end gap-3 mt-10">
//         <button
//             onClick={handleEdit}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200 flex items-center gap-2"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//             </svg>
//             Generate Invoice
//           </button>
//         </div>
//     </div>
//   );
// }