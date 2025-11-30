"use client";

import { useState } from "react";
import Link from "next/link";
import { Bank } from "@/utils/types";
import { deleteBank } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";

interface BankTableProps {
  initialBanks: Bank[];
}

export default function BankTable({ initialBanks }: BankTableProps) {
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; bankId?: number; bankName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (bankId?: number, bankName?: string) => {
    if (!bankId) return;
    setDeleteModal({ isOpen: true, bankId, bankName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.bankId) return;

    try {
      await deleteBank(deleteModal.bankId);
      setBanks(prev => prev.filter(bank => bank.id !== deleteModal.bankId));
      showToast('Bank deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete bank', 'error');
    } finally {
      setDeleteModal({ isOpen: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false });
  };

  const formatWebsite = (website: string) => {
    if (!website) return "-";
    // Remove protocol for display
    const displayUrl = website.replace(/^https?:\/\//, '');
    return (
      <a 
        href={website.startsWith('http') ? website : `https://${website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        {displayUrl}
      </a>
    );
  };

  return (
    <>
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
                Head Office Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
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
            {banks.map(bank => (
              <tr key={bank.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{bank.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                  {bank.nameBn && (
                    <div className="text-sm text-gray-500">{bank.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {bank.headOfficeAddress || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatWebsite(bank.website || '')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={bank.active} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={bank.id} 
                    itemName={bank.name}
                    itemType="bank"
                    onDeleteClick={handleDeleteClick} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {banks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No banks found</p>
            <Link 
              href="/banks/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first bank
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={deleteModal.bankName || "this bank"}
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