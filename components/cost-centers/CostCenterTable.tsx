"use client";

import { useState, useMemo } from "react";
import { CostCenter, CostCenterType } from "@/utils/types";
import { deleteCostCenter } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface CostCenterTableProps {
  initialCostCenters: CostCenter[];
}

export default function CostCenterTable({ initialCostCenters }: CostCenterTableProps) {
  const [costCenters, setCostCenters] = useState<CostCenter[]>(initialCostCenters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; costCenterId?: number; costCenterName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter cost centers based on search term
  const filteredCostCenters = useMemo(() => {
    if (!searchTerm.trim()) return costCenters;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return costCenters.filter(cc => 
      cc.code.toLowerCase().includes(lowercasedSearch) ||
      cc.name.toLowerCase().includes(lowercasedSearch) ||
      (cc.nameBn && cc.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      cc.costCenterType.toLowerCase().includes(lowercasedSearch)
    );
  }, [costCenters, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredCostCenters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedCostCenters = useMemo(() => {
    return filteredCostCenters.slice(startIndex, endIndex);
  }, [filteredCostCenters, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (costCenterId?: number, costCenterName?: string) => {
    if (!costCenterId) return;
    setDeleteModal({ isOpen: true, costCenterId, costCenterName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.costCenterId) return;

    try {
      setIsLoading(true);
      await deleteCostCenter(deleteModal.costCenterId);
      setCostCenters(prev => prev.filter(cc => cc.id !== deleteModal.costCenterId));
      showToast('Cost center deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete cost center', 'error');
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

  const getTypeBadge = (type: CostCenterType) => {
    const typeColors = {
      [CostCenterType.SHOP]: "bg-blue-100 text-blue-800",
      [CostCenterType.OFFICE]: "bg-purple-100 text-purple-800",
      [CostCenterType.INVENTORY]: "bg-orange-100 text-orange-800",
      [CostCenterType.GENERAL]: "bg-gray-100 text-gray-800"
    };
    
    const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type}
      </span>
    );
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search cost centers by code, name, type..."
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
                Cost Center Details
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {paginatedCostCenters.map(cc => (
              <tr key={cc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cc.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cc.name}</div>
                  {cc.nameBn && (
                    <div className="text-sm text-gray-500">{cc.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTypeBadge(cc.costCenterType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={cc.active} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={cc.id}
                    itemName={cc.name}
                    itemType="cost-center"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedCostCenters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching cost centers found" : "No cost centers found"}
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
                href="/cost-center/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first cost center
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
        itemName={deleteModal.costCenterName || "this cost center"}
        itemType="cost-center"
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