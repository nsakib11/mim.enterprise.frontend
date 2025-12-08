"use client";

import { useState, useMemo } from "react";
import { Shop } from "@/utils/types";
import { deleteShop } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface ShopTableProps {
  initialShops: Shop[];
}

export default function ShopTable({ initialShops }: ShopTableProps) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; shopId?: number; shopName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter shops based on search term
  const filteredShops = useMemo(() => {
    if (!searchTerm.trim()) return shops;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return shops.filter(shop => 
      shop.code.toLowerCase().includes(lowercasedSearch) ||
      shop.name.toLowerCase().includes(lowercasedSearch) ||
      (shop.nameBn && shop.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      (shop.address && shop.address.toLowerCase().includes(lowercasedSearch))
    );
  }, [shops, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredShops.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedShops = useMemo(() => {
    return filteredShops.slice(startIndex, endIndex);
  }, [filteredShops, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (shopId?: number, shopName?: string) => {
    if (!shopId) return;
    setDeleteModal({ isOpen: true, shopId, shopName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.shopId) return;

    try {
      setIsLoading(true);
      await deleteShop(deleteModal.shopId);
      setShops(prev => prev.filter(shop => shop.id !== deleteModal.shopId));
      showToast('Shop deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete shop', 'error');
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

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTargetMetrics = () => {
    const totalMonthlyTarget = shops.reduce((sum, shop) => sum + (shop.monthlySalesTarget || 0), 0);
    const totalYearlyTarget = shops.reduce((sum, shop) => sum + (shop.yearlySalesTarget || 0), 0);
    const averageMonthlyTarget = shops.length > 0 ? totalMonthlyTarget / shops.length : 0;
    const averageYearlyTarget = shops.length > 0 ? totalYearlyTarget / shops.length : 0;
    const shopsWithTargets = shops.filter(shop => shop.monthlySalesTarget || shop.yearlySalesTarget).length;
    
    return {
      totalMonthlyTarget,
      totalYearlyTarget,
      averageMonthlyTarget,
      averageYearlyTarget,
      shopsWithTargets
    };
  };

  const targetMetrics = calculateTargetMetrics();

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search shops by code, name, address..."
        isLoading={isLoading}
        showRefresh={false}
      />

      <div className="bg-white rounded-lg shadow overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Target
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yearly Target
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedShops.map(shop => (
              <tr key={shop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shop.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                  {shop.nameBn && (
                    <div className="text-sm text-gray-500">{shop.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {shop.address || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className={`font-medium ${shop.monthlySalesTarget ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formatCurrency(shop.monthlySalesTarget)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className={`font-medium ${shop.yearlySalesTarget ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formatCurrency(shop.yearlySalesTarget)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={shop.active || false} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={shop.id}
                    itemName={shop.name}
                    itemType="shop"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedShops.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching shops found" : "No shops found"}
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
                href="/shops/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first shop
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
        itemName={deleteModal.shopName || "this shop"}
        itemType="shop"
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}