"use client";

import { useState, useMemo } from "react";
import { PurchaseResponse, Supplier } from "@/utils/types";
import { deletePurchase } from "@/utils/api";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface PurchaseTableProps {
  initialPurchases: PurchaseResponse[];
  initialSuppliers: Supplier[];
}

export default function PurchaseTable({ 
  initialPurchases, 
  initialSuppliers 
}: PurchaseTableProps) {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>(initialPurchases);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; purchaseId?: number; purchaseNo?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter purchases based on search term
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return purchases.filter(purchase => 
      purchase.purchaseOrderNo.toLowerCase().includes(lowercasedSearch) ||
      (purchase.supplierName && purchase.supplierName.toLowerCase().includes(lowercasedSearch)) ||
      purchase.paymentStatus.toLowerCase().includes(lowercasedSearch) ||
      purchase.deliveryStatus.toLowerCase().includes(lowercasedSearch)
    );
  }, [purchases, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredPurchases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedPurchases = useMemo(() => {
    return filteredPurchases.slice(startIndex, endIndex);
  }, [filteredPurchases, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (purchaseId?: number, purchaseNo?: string) => {
    if (!purchaseId) return;
    setDeleteModal({ isOpen: true, purchaseId, purchaseNo });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.purchaseId) return;

    try {
      setIsLoading(true);
      await deletePurchase(deleteModal.purchaseId);
      setPurchases(prev => prev.filter(purchase => purchase.id !== deleteModal.purchaseId));
      showToast('Purchase deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete purchase', 'error');
    } finally {
      setIsLoading(false);
      setDeleteModal({ isOpen: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PAID: "bg-green-100 text-green-800",
      PARTIAL: "bg-yellow-100 text-yellow-800",
      DUE: "bg-red-100 text-red-800",
      PENDING: "bg-gray-100 text-gray-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-indigo-100 text-indigo-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  const getSupplierName = (purchase: PurchaseResponse) => {
    return purchase.supplierName || "-";
  };

  const getPaymentStatusSummary = () => {
    const paid = purchases.filter(p => p.paymentStatus === 'PAID').length;
    const due = purchases.filter(p => p.paymentStatus === 'DUE').length;
    const partial = purchases.filter(p => p.paymentStatus === 'PARTIAL').length;
    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const paidAmount = purchases
      .filter(p => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + p.totalAmount, 0);
    
    return { paid, due, partial, totalAmount, paidAmount };
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search purchases by PO No, supplier, status..."
        isLoading={isLoading}
        showRefresh={false}
      />

      <div className="bg-white rounded-lg shadow overflow-visible">
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
            {paginatedPurchases.map(purchase => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {purchase.purchaseOrderNo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getSupplierName(purchase)}
                  </div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={purchase.id}
                    itemName={purchase.purchaseOrderNo}
                    itemType="purchase"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedPurchases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching purchases found" : "No purchases found"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Clear search
              </button>
            ) : (
              <Link 
                href="/purchases/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Create your first purchase
              </Link>
            )}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex + 1} // +1 because it's 1-indexed for display
          endIndex={endIndex}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={`Purchase #${deleteModal.purchaseNo}` || "this purchase"}
        itemType="purchase"
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      {/* Summary Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 mb-1">{purchases.length}</div>
            <div className="text-sm text-gray-600">Total Purchases</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {formatCurrency(getPaymentStatusSummary().paidAmount)}
            </div>
            <div className="text-sm text-gray-600">Paid Amount</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700 mb-1">
              {purchases.filter(p => p.paymentStatus === 'DUE' || p.paymentStatus === 'PARTIAL').length}
            </div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {new Set(purchases.map(p => p.supplierId)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Suppliers</div>
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Status Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Payment Status</div>
              <div className="space-y-2">
                {['PAID', 'DUE', 'PARTIAL', 'PENDING'].map(status => {
                  const count = purchases.filter(p => p.paymentStatus === status).length;
                  const percentage = purchases.length > 0 ? (count / purchases.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{status}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Delivery Status</div>
              <div className="space-y-2">
                {['COMPLETED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'PENDING'].map(status => {
                  const count = purchases.filter(p => p.deliveryStatus === status).length;
                  const percentage = purchases.length > 0 ? (count / purchases.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{status}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}