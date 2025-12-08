"use client";

import { useState } from "react";
import Link from "next/link";
import { BankBranch, Bank } from "@/utils/types";
import { deleteBankBranch } from "@/utils/api";
import { usePagination } from "@/utils/usePagination";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";

interface BankBranchTableProps {
  initialBranches: BankBranch[];
  initialBanks: Bank[];
}

export default function BankBranchTable({ 
  initialBranches, 
  initialBanks 
}: BankBranchTableProps) {
  const [bankBranches, setBankBranches] = useState<BankBranch[]>(initialBranches);
  const [banks] = useState<Bank[]>(initialBanks);
  
  // Use pagination hook
  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    searchTerm,
    setSearchTerm,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    setPageSize,
  } = usePagination({
    data: bankBranches,
    itemsPerPage: 10,
    searchableFields: ['code', 'name', 'nameBn', 'address', 'mobile', 'email', 'routingNo'],
  });
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; branchId?: number; branchName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (branchId?: number, branchName?: string) => {
    if (!branchId) return;
    setDeleteModal({ isOpen: true, branchId, branchName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.branchId) return;

    try {
      setIsLoading(true);
      await deleteBankBranch(deleteModal.branchId);
      // Remove from local state
      setBankBranches(prev => prev.filter(branch => branch.id !== deleteModal.branchId));
      showToast('Bank branch deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete bank branch', 'error');
    } finally {
      setIsLoading(false);
      setDeleteModal({ isOpen: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPageSize(limit);
  };

  const getBankName = (bankId?: number) => {
    if (!bankId) return "-";
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : "-";
  };

  const getBankCode = (bankId?: number) => {
    if (!bankId) return "";
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.code : "";
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search bank branches..."
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
                Bank Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Routing No
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
            {paginatedData.map(branch => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{branch.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getBankName(branch.bank?.id)}
                  </div>
                  {getBankCode(branch.bank?.id) && (
                    <div className="text-sm text-gray-500">{getBankCode(branch.bank?.id)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                  {branch.nameBn && (
                    <div className="text-sm text-gray-500">{branch.nameBn}</div>
                  )}
                  {branch.address && (
                    <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                      {branch.address}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {branch.contactPersonName || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {branch.mobile && (
                    <div className="text-sm text-gray-900">{branch.mobile}</div>
                  )}
                  {branch.email && (
                    <div className="text-sm text-gray-500">{branch.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">
                    {branch.routingNo || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={branch.active} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={branch.id}
                    itemName={branch.name}
                    itemType="bank-branch"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching bank branches found" : "No bank branches found"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Clear search
              </button>
            ) : (
              <Link 
                href="/bank-branches/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first bank branch
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
          itemsPerPage={10}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={deleteModal.branchName || "this bank branch"}
        itemType="bank-branch"
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