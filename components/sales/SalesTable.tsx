"use client";

import { useState, useMemo } from "react";
import { Sales } from "@/utils/types";
import { deleteSale } from "@/utils/api";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface SalesTableProps {
  initialSales: Sales[];
}

export default function SalesTable({ initialSales }: SalesTableProps) {
  const [sales, setSales] = useState<Sales[]>(initialSales);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; saleId?: number; invoiceNo?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter sales based on search term
  const filteredSales = useMemo(() => {
    if (!searchTerm.trim()) return sales;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return sales.filter(sale => 
      sale.invoiceNo.toLowerCase().includes(lowercasedSearch) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(lowercasedSearch)) ||
      sale.paymentStatus.toLowerCase().includes(lowercasedSearch) ||
      sale.deliveryStatus.toLowerCase().includes(lowercasedSearch)
    );
  }, [sales, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredSales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedSales = useMemo(() => {
    return filteredSales.slice(startIndex, endIndex);
  }, [filteredSales, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (saleId?: number, invoiceNo?: string) => {
    if (!saleId) return;
    setDeleteModal({ isOpen: true, saleId, invoiceNo });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.saleId) return;

    try {
      setIsLoading(true);
      await deleteSale(deleteModal.saleId);
      setSales(prev => prev.filter(sale => sale.id !== deleteModal.saleId));
      showToast('Sale deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete sale', 'error');
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

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      'PAID': "bg-green-100 text-green-800",
      'PARTIAL': "bg-yellow-100 text-yellow-800",
      'UNPAID': "bg-red-100 text-red-800",
      'DUE': "bg-red-100 text-red-800",
      'PENDING': "bg-gray-100 text-gray-800"
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
      'PENDING': "bg-gray-100 text-gray-800",
      'SHIPPED': "bg-blue-100 text-blue-800",
      'DELIVERED': "bg-green-100 text-green-800",
      'CANCELLED': "bg-red-100 text-red-800"
    };
    
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const totalAmount = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalPaid = sales.reduce((sum, sale) => sum + (sale.paidAmount || 0), 0);
    const totalDue = sales.reduce((sum, sale) => sum + (sale.dueAmount || 0), 0);
    const paidCount = sales.filter(sale => sale.paymentStatus === 'PAID').length;
    const partialCount = sales.filter(sale => sale.paymentStatus === 'PARTIAL').length;
    const unpaidCount = sales.filter(sale => sale.paymentStatus === 'DUE').length;
    const completedCount = sales.filter(sale => sale.deliveryStatus === 'COMPLETED').length;
    const pendingCount = sales.filter(sale => sale.deliveryStatus === 'PENDING').length;
    
    return {
      totalAmount,
      totalPaid,
      totalDue,
      paidCount,
      partialCount,
      unpaidCount,
      completedCount,
      pendingCount
    };
  };

  const summary = calculateSummary();

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search sales by invoice no, customer, status..."
        isLoading={isLoading}
        showRefresh={false}
      />

      <div className="bg-white rounded-lg shadow overflow-visible">
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
            {paginatedSales.map(sale => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(sale.totalAmount || 0)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className={`font-medium ${sale.paidAmount ? 'text-green-600' : 'text-gray-500'}`}>
                    {formatCurrency(sale.paidAmount || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className={`font-medium ${sale.dueAmount ? 'text-red-600' : 'text-gray-500'}`}>
                    {formatCurrency(sale.dueAmount || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getPaymentStatusBadge(sale.paymentStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getDeliveryStatusBadge(sale.deliveryStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={sale.id}
                    itemName={sale.invoiceNo}
                    itemType="sale"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedSales.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching sales found" : "No sales found"}
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
                href="/sales/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Create your first sale
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
        itemName={`Sale #${deleteModal.invoiceNo}` || "this sale"}
        itemType="sale"
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Summary</h3>
        
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 mb-1">{formatCurrency(summary.totalAmount)}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">{formatCurrency(summary.totalPaid)}</div>
            <div className="text-sm text-gray-600">Total Paid</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700 mb-1">{formatCurrency(summary.totalDue)}</div>
            <div className="text-sm text-gray-600">Total Due</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700 mb-1">{sales.length}</div>
            <div className="text-sm text-gray-600">Total Invoices</div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Payment Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{summary.paidCount}</span>
                  <span className="text-xs text-gray-500">
                    ({sales.length > 0 ? ((summary.paidCount / sales.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-yellow-100"></div>
                  <span className="text-sm text-gray-600">Partial</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{summary.partialCount}</span>
                  <span className="text-xs text-gray-500">
                    ({sales.length > 0 ? ((summary.partialCount / sales.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
                  <span className="text-sm text-gray-600">Unpaid/Due</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{summary.unpaidCount}</span>
                  <span className="text-xs text-gray-500">
                    ({sales.length > 0 ? ((summary.unpaidCount / sales.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Delivery Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{summary.completedCount}</span>
                  <span className="text-xs text-gray-500">
                    ({sales.length > 0 ? ((summary.completedCount / sales.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-gray-100"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{summary.pendingCount}</span>
                  <span className="text-xs text-gray-500">
                    ({sales.length > 0 ? ((summary.pendingCount / sales.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Payment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Collection Rate</div>
              <div className="text-xl font-bold text-green-700">
                {summary.totalAmount > 0 ? ((summary.totalPaid / summary.totalAmount) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Percentage of total amount collected</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Outstanding Rate</div>
              <div className="text-xl font-bold text-red-700">
                {summary.totalAmount > 0 ? ((summary.totalDue / summary.totalAmount) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Percentage of total amount outstanding</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}