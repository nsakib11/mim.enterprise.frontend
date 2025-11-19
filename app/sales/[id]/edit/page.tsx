/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sales, SalesItem, Customer, Product, Employee, Inventory, PaymentStatus, PaymentMethod, ProductCategory } from "@/utils/types";
import { getSale, updateSale, getCustomers, getProducts, getEmployees, getInventories } from "@/utils/api";
import Link from "next/link";

export default function EditSale() {
  const router = useRouter();
  const params = useParams();
  const saleId = Number(params.id);

  const [sale, setSale] = useState<Sales | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [saleData, customersData, productsData, employeesData, inventoriesData] = await Promise.all([
          getSale(saleId),
          getCustomers(),
          getProducts(),
          getEmployees(),
          getInventories()
        ]);
        
        // Transform API response to form data with full objects
        const transformedSale: Sales = {
          ...saleData,
          customer: customersData.find(c => c.id === saleData.customerId) || undefined,
          salesPerson: employeesData.find(e => e.id === saleData.salesPersonId) || undefined,
          inventory: inventoriesData.find(i => i.id === saleData.inventoryId) || undefined,
          salesItems: saleData.salesItems?.map((item: SalesItem) => ({
            ...item,
            product: productsData.find(p => p.id === (item as any).productId) || item.product
          })) || []
        };
        
        setSale(transformedSale);
        setCustomers(customersData);
        setProducts(productsData);
        setEmployees(employeesData);
        setInventories(inventoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [saleId]);

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setSale(prev => {
      if (!prev) return null;

      const updatedSale = { ...prev };

      if (name === "customerId") {
        const selectedCustomer = customers.find(customer => customer.id === Number(value));
        updatedSale.customerId = Number(value);
        updatedSale.customerName = selectedCustomer?.name;
        updatedSale.customer = selectedCustomer;
      } else if (name === "salesPersonId") {
        const selectedEmployee = employees.find(employee => employee.id === Number(value));
        updatedSale.salesPersonId = Number(value);
        updatedSale.salesPersonName = selectedEmployee?.name;
        updatedSale.salesPerson = selectedEmployee;
      } else if (name === "inventoryId") {
        const selectedInventory = inventories.find(inventory => inventory.id === Number(value));
        updatedSale.inventoryId = Number(value);
        updatedSale.inventoryName = selectedInventory?.name;
        updatedSale.inventory = selectedInventory;
      } else if (type === 'checkbox') {
        (updatedSale as any)[name] = (e.target as HTMLInputElement).checked;
      } else if (name === "paidAmount") {
        const paid = parseFloat(value) || 0;
        const total = updatedSale.totalAmount || 0;
        const due = total - paid;
        
        let paymentStatus = PaymentStatus.DUE;
        if (paid === 0) paymentStatus = PaymentStatus.DUE;
        else if (paid >= total) paymentStatus = PaymentStatus.PAID;
        else paymentStatus = PaymentStatus.PARTIAL;
        
        updatedSale.paidAmount = paid;
        updatedSale.dueAmount = due;
        updatedSale.paymentStatus = paymentStatus;
      } else {
        (updatedSale as any)[name] = value;
      }

      return updatedSale;
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number | Product) => {
    setSale(prev => {
      if (!prev) return prev;
      const updatedItems = [...(prev.salesItems || [])];
      const item = { ...updatedItems[index] };
      
      if (field === 'product') {
        const product = value as Product;
        item.product = product;
        item.productName = product?.name || '';
      } else {
        (item as any)[field] = value;
      }
      
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? Number(value) : item.quantity || 0;
        const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice || 0;
        item.totalPrice = quantity * unitPrice;
      }
      
      // Calculate pending quantity
      if (field === 'quantity' || field === 'deliveredQuantity') {
        const quantity = field === 'quantity' ? Number(value) : item.quantity || 0;
        const deliveredQuantity = field === 'deliveredQuantity' ? Number(value) : item.deliveredQuantity || 0;
        item.pendingQuantity = Math.max(0, quantity - deliveredQuantity);
      }
      
      updatedItems[index] = item;
      
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      const paidAmount = prev.paidAmount || 0;
      const dueAmount = Math.max(0, totalAmount - paidAmount);

      let paymentStatus = PaymentStatus.DUE;
      if (paidAmount === 0) paymentStatus = PaymentStatus.DUE;
      else if (paidAmount >= totalAmount) paymentStatus = PaymentStatus.PAID;
      else paymentStatus = PaymentStatus.PARTIAL;

      return {
        ...prev,
        salesItems: updatedItems,
        totalAmount,
        dueAmount,
        paymentStatus
      };
    });
  };

  const addItem = () => {
    setSale(prev => prev ? {
      ...prev,
      salesItems: [
        ...(prev.salesItems || []),
        {
          id: 0,
          product: undefined,
          productName: '',
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
          productCategory: ProductCategory.HARDWARE,
          deliveredQuantity: 0,
          pendingQuantity: 0
        }
      ]
    } : prev);
  };

  const removeItem = (index: number) => {
    setSale(prev => prev ? {
      ...prev,
      salesItems: prev.salesItems?.filter((_, i) => i !== index) || []
    } : prev);
  };

  // Helper function to format datetime for input[type="datetime-local"]
  const formatDateTimeForInput = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    return dateTimeString.slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;
    
    try {
      setIsSubmitting(true);
      await updateSale(saleId, sale);
      router.push("/sales");
    } catch (error) {
      console.error("Error updating sale:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sale data...</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sale not found</h3>
         
          <div className="mt-6">
            <Link
              href="/sales"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sales
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Sales Invoice</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update sales invoice information. Make changes to the fields below as needed.
              </p>
              <p className="mt-1 text-sm text-blue-600 font-medium">
                Invoice No: {sale.invoiceNo}
              </p>
            </div>
            
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Master Information */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sales Information</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice No */}
                <div>
                  <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice No
                  </label>
                  <input 
                    id="invoiceNo"
                    type="text" 
                    name="invoiceNo" 
                    value={sale.invoiceNo} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
                    required 
                    readOnly
                  />
                  <p className="mt-1 text-sm text-gray-500">Invoice number cannot be changed</p>
                </div>

                {/* Customer */}
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="customerId"
                    name="customerId" 
                    value={sale.customerId || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Date */}
                <div>
                  <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="invoiceDate"
                    type="datetime-local" 
                    name="invoiceDate" 
                    value={formatDateTimeForInput(sale.invoiceDate)} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required 
                  />
                </div>

                {/* Sales Person */}
                <div>
                  <label htmlFor="salesPersonId" className="block text-sm font-medium text-gray-700 mb-2">
                    Sales Person
                  </label>
                  <select 
                    id="salesPersonId"
                    name="salesPersonId" 
                    value={sale.salesPersonId || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Sales Person</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Token */}
                <div>
                  <label htmlFor="deliveryToken" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Token
                  </label>
                  <input 
                    id="deliveryToken"
                    type="text" 
                    name="deliveryToken" 
                    value={sale.deliveryToken || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter delivery token"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select 
                    id="paymentMethod"
                    name="paymentMethod" 
                    value={sale.paymentMethod} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(PaymentMethod).map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {/* Inventory */}
                <div>
                  <label htmlFor="inventoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Inventory
                  </label>
                  <select 
                    id="inventoryId"
                    name="inventoryId" 
                    value={sale.inventoryId || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Inventory</option>
                    {inventories.map(inventory => (
                      <option key={inventory.id} value={inventory.id}>
                        {inventory.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Return Valid Until */}
                <div>
                  <label htmlFor="returnValidUntil" className="block text-sm font-medium text-gray-700 mb-2">
                    Return Valid Until
                  </label>
                  <input 
                    id="returnValidUntil"
                    type="datetime-local" 
                    name="returnValidUntil" 
                    value={formatDateTimeForInput(sale.returnValidUntil)} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
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
                    value={sale.paidAmount} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Delivery Address */}
                <div className="md:col-span-2">
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <input 
                    id="deliveryAddress"
                    type="text" 
                    name="deliveryAddress" 
                    value={sale.deliveryAddress || ""} 
                    onChange={handleMasterChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter delivery address"
                  />
                </div>

                {/* Is Returned */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input 
                      id="isReturned"
                      type="checkbox" 
                      name="isReturned" 
                      checked={sale.isReturned} 
                      onChange={handleMasterChange} 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                    />
                    <label htmlFor="isReturned" className="ml-2 block text-sm text-gray-900">
                      Mark as Returned
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Check this if the sale involves returned items.
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-blue-800">Total Amount</label>
                  <p className="text-xl font-bold text-blue-900">${sale.totalAmount?.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-green-800">Paid Amount</label>
                  <p className="text-xl font-bold text-green-900">${sale.paidAmount?.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <label className="block text-sm font-medium text-red-800">Due Amount</label>
                  <p className="text-xl font-bold text-red-900">${sale.dueAmount?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Items */}
          <div className="bg-white shadow-sm rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Sales Items</h2>
              <button 
                type="button" 
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="px-6 py-6">
              {sale.salesItems?.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {/* Product */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                      <select 
                        value={item.product?.id || ""} 
                        onChange={(e) => {
                          const productId = Number(e.target.value);
                          const product = products.find(p => p.id === productId);
                          handleItemChange(index, 'product', product as Product);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                      <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    {/* Total Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
                      <input 
                        type="number" 
                        value={item.totalPrice} 
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
                        step="0.01"
                      />
                    </div>

                    {/* Delivered Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivered Qty</label>
                      <input 
                        type="number" 
                        value={item.deliveredQuantity} 
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', e.target.value)}
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
              href="/sales"
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
                'Update Sales Invoice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}