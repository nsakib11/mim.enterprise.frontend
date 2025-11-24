"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Purchase, 
  PurchaseResponse, 
  PurchaseItem, 
  PurchaseItemResponse, 
  Supplier, 
  Product, 
  PaymentType, 
  PaymentStatus, 
  ProductCategory ,
  Inventory
} from "@/utils/types";
import { getPurchase, updatePurchase, getSuppliers, getProducts, getProductsBySupplier, getInventories } from "@/utils/api";
import Link from "next/link";

export default function EditPurchase() {
  const router = useRouter();
  const params = useParams();
  const purchaseId = Number(params.id);

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [purchaseData, suppliersData, productsData, inventoryData] = await Promise.all([
          getPurchase(purchaseId),
          getSuppliers(),
          getProducts(),
          getInventories(), 
        ]);
        
        // Transform PurchaseResponse to Purchase for form
        const purchaseResponse = purchaseData as PurchaseResponse;
        const transformedPurchase: Purchase = {
          ...purchaseResponse,
          supplier: suppliersData.find(s => s.id === purchaseResponse.supplierId) || undefined,
          purchaseItems: purchaseResponse.purchaseItems?.map((item: PurchaseItemResponse) => ({
            ...item,
            product: productsData.find(p => p.id === item.productId) || undefined
          })) || []
        };
        
        setPurchase(transformedPurchase);
        setSuppliers(suppliersData);
        setAllProducts(productsData);
        setInventories(inventoryData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [purchaseId]);

  // Fetch products when supplier changes
  useEffect(() => {
    if (purchase?.supplier?.id) {
      setLoadingProducts(true);
      
      const fetchSupplierProducts = async () => {
        try {
          const products = await getProductsBySupplier(purchase.supplier!.id!);
          setSupplierProducts(products);
        } catch (error) {
          console.error('Error fetching supplier products:', error);
          setSupplierProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchSupplierProducts();
    } else {
      setSupplierProducts([]);
    }
  }, [purchase?.supplier]);

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "supplier") {
      const selectedSupplier = suppliers.find(s => s.id === Number(value));
      setPurchase(prev => prev ? { 
        ...prev, 
        supplier: selectedSupplier,
        purchaseItems: []
      } : prev);
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPurchase(prev => prev ? { ...prev, [name]: checked } : prev);
    } else if (name === "paidAmount") {
      const paid = parseFloat(value) || 0;
      const due = (purchase?.totalAmount || 0) - paid;
      setPurchase(prev => prev ? {
        ...prev,
        paidAmount: paid,
        dueAmount: due,
        paymentStatus: paid === 0 ? PaymentStatus.DUE : paid === prev.totalAmount ? PaymentStatus.PAID : PaymentStatus.PARTIAL
      } : prev);
    } else if (name === "orderDate" || name === "expectedDeliveryDate") {
      const dateValue = value ? value + ":00" : "";
      setPurchase(prev => prev ? { ...prev, [name]: dateValue } : prev);
    } else {
      setPurchase(prev => prev ? { ...prev, [name]: value } : prev);
    }
  };

 const handleItemChange = (
  index: number, 
  field: keyof PurchaseItem, 
  value: string | number | Product | ProductCategory
) => {
  setPurchase(prev => {
    if (!prev) return prev;

    const updatedItems = [...(prev.purchaseItems || [])];

    // Update field value
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Auto calculate pending quantity
    const ordered = updatedItems[index].orderedQuantity || 0;
    const delivered = updatedItems[index].deliveredQuantity || 0;

    updatedItems[index].pendingQuantity = Math.max(ordered - delivered, 0);

    // Recalculate summary values
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + (item.purchasePrice || 0) * (item.orderedQuantity || 0),
      0
    );

    const totalOrderedQuantity = updatedItems.reduce(
      (sum, item) => sum + (item.orderedQuantity || 0),
      0
    );

    return {
      ...prev,
      purchaseItems: updatedItems,
      totalAmount,
      totalOrderedQuantity,
      dueAmount: totalAmount - (prev.paidAmount || 0)
    };
  });
};

  const addItem = () => {
    setPurchase(prev => prev ? {
      ...prev,
      purchaseItems: [
        ...(prev.purchaseItems || []),
        {
          product: undefined,
          inventory: undefined, 
          orderedQuantity: 0,
          deliveredQuantity: 0,
          pendingQuantity: 0,
          purchasePrice: 0,
          salesPriceMin: 0,
          salesPriceMax: 0,
          currentPurchasePrice: 0,
          productCategory: ProductCategory.HARDWARE
        }
      ]
    } : prev);
  };

  const removeItem = (index: number) => {
    setPurchase(prev => prev ? {
      ...prev,
      purchaseItems: prev.purchaseItems?.filter((_, i) => i !== index) || []
    } : prev);
  };

  // Helper function to format datetime for input[type="datetime-local"]
  const formatDateTimeForInput = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    return dateTimeString.slice(0, 16);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!purchase) return;

  try {
    setIsSubmitting(true);

    // Map purchase items to match PurchaseItemDto
    const purchaseItemsDto = purchase.purchaseItems?.map(item => ({
      id: item.id,
      productId: item.product?.id,
      productName: item.product?.name || "",
      inventoryId: item.inventory?.id,
      orderedQuantity: item.orderedQuantity || 0,
      deliveredQuantity: item.deliveredQuantity || 0,
      pendingQuantity: item.pendingQuantity || 0,
      purchasePrice: item.purchasePrice || 0,
      salesPriceMin: item.salesPriceMin || 0,
      salesPriceMax: item.salesPriceMax || 0,
      currentPurchasePrice: item.currentPurchasePrice || 0,
      productCategory: item.productCategory || "HARDWARE"
    }));

    const submitData = {
      ...purchase,
      supplierId: purchase.supplier?.id,
      purchaseItems: purchaseItemsDto
    };

    await updatePurchase(purchaseId, submitData);
    router.push("/purchases");
  } catch (error) {
    console.error("Error updating purchase:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase data...</p>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Purchase not found</h3>
         
          <div className="mt-6">
            <Link
              href="/purchases"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Purchases
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get products to display in dropdown (supplier products if available, otherwise all products)
  const displayProducts = purchase.supplier ? supplierProducts : allProducts;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Purchase Order</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update purchase order information. Make changes to the fields below as needed.
              </p>
              <p className="mt-1 text-sm text-blue-600 font-medium">
                Order No: {purchase.purchaseOrderNo}
              </p>
            </div>
           
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Master Information */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Information</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purchase Order No */}
                <div>
                  <label htmlFor="purchaseOrderNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Order No
                  </label>
                  <input 
                    id="purchaseOrderNo"
                    type="text" 
                    name="purchaseOrderNo" 
                    value={purchase.purchaseOrderNo} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
                    readOnly
                  />
                  <p className="mt-1 text-sm text-gray-500">Purchase order number cannot be changed</p>
                </div>

                {/* Supplier */}
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="supplier"
                    name="supplier" 
                    value={purchase.supplier?.id || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                {/* Order Date */}
                <div>
                  <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="orderDate"
                    type="datetime-local" 
                    name="orderDate" 
                    value={formatDateTimeForInput(purchase.orderDate)} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required 
                  />
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date
                  </label>
                  <input 
                    id="expectedDeliveryDate"
                    type="datetime-local" 
                    name="expectedDeliveryDate" 
                    value={formatDateTimeForInput(purchase.expectedDeliveryDate)} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>

                {/* Payment Type */}
                <div>
                  <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select 
                    id="paymentType"
                    name="paymentType" 
                    value={purchase.paymentType} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(PaymentType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Paid Amount */}
                <div>
                  <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Paid Amount
                  </label>
                  <input 
                    id="paidAmount"
                    type="number" 
                    name="paidAmount" 
                    value={purchase.paidAmount} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Price Locked */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input 
                      id="priceLocked"
                      type="checkbox" 
                      name="priceLocked" 
                      checked={purchase.priceLocked} 
                      onChange={handleMasterChange} 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                    />
                    <label htmlFor="priceLocked" className="ml-2 block text-sm text-gray-900">
                      Price Locked
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Lock purchase prices to prevent automatic updates from supplier price changes.
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-blue-800">Total Amount</label>
                  <p className="text-xl font-bold text-blue-900">৳{purchase.totalAmount?.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-green-800">Paid Amount</label>
                  <p className="text-xl font-bold text-green-900">৳{purchase.paidAmount?.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-red-800">Due Amount</label>
                  <p className="text-xl font-bold text-red-900">৳{purchase.dueAmount?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Items */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Items</h2>
              <button 
                type="button" 
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!purchase.supplier}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="px-6 py-6">
              {!purchase.supplier && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-700">Please select a supplier first to add purchase items</p>
                  </div>
                </div>
              )}

              {loadingProducts && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <p className="text-sm text-blue-700">Loading products for selected supplier...</p>
                  </div>
                </div>
              )}

              {purchase.purchaseItems?.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Product */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                      <select 
                        value={item.product?.id || ""} 
                        onChange={(e) => handleItemChange(index, 'product', displayProducts.find(p => p.id === Number(e.target.value)) as Product)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100"
                        disabled={!purchase.supplier || loadingProducts}
                      >
                        <option value="">Select Product</option>
                        {displayProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </select>
                    </div>
{/* Inventory Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Inventory Location
  </label>

  <select
    value={item.inventory?.id || ""}
    onChange={(e) =>
      handleItemChange(
        index,
        "inventory",
        inventories.find((inv) => inv.id === Number(e.target.value))!
      )
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select Inventory</option>
    {inventories.map((inv) => (
      <option key={inv.id} value={inv.id}>
        {inv.name} ({inv.code})
      </option>
    ))}
  </select>
</div>

                    {/* Ordered Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ordered Qty</label>
                      <input 
                        type="number" 
                        value={item.orderedQuantity} 
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    {/* Purchase Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                      <input 
                        type="number" 
                        value={item.purchasePrice} 
                        onChange={(e) => handleItemChange(index, 'purchasePrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    {/* Total Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                      <input 
                        type="number" 
                        value={(item.orderedQuantity * item.purchasePrice).toFixed(2)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
                        readOnly
                        step="0.01"
                      />
                    </div>
 {/* Delivered Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivered Qty</label>
                      <input 
                        type="number" 
                        value={item.deliveredQuantity} 
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    {/* Pending Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pending Qty</label>
                      <input 
                        type="number" 
                        value={item.pendingQuantity} 
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
                        step="0.01"
                      />
                    </div>
                    {/* Remove Button */}
                    <div className="flex items-end">
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/purchases"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Purchase Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}