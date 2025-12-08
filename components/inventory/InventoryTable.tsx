"use client";

import { useState, useMemo } from "react";
import { Inventory } from "@/utils/types";
import { deleteInventory } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface InventoryTableProps {
  initialInventories: Inventory[];
}

export default function InventoryTable({ initialInventories }: InventoryTableProps) {
  const [inventories, setInventories] = useState<Inventory[]>(initialInventories);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; inventoryId?: number; inventoryName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter inventories based on search term
  const filteredInventories = useMemo(() => {
    if (!searchTerm.trim()) return inventories;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return inventories.filter(inventory => 
      inventory.code.toLowerCase().includes(lowercasedSearch) ||
      inventory.name.toLowerCase().includes(lowercasedSearch) ||
      (inventory.nameBn && inventory.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      (inventory.address && inventory.address.toLowerCase().includes(lowercasedSearch)) ||
      (inventory.responsiblePerson && inventory.responsiblePerson.toLowerCase().includes(lowercasedSearch)) ||
      (inventory.mobile && inventory.mobile.toLowerCase().includes(lowercasedSearch))
    );
  }, [inventories, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredInventories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedInventories = useMemo(() => {
    return filteredInventories.slice(startIndex, endIndex);
  }, [filteredInventories, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (inventoryId?: number, inventoryName?: string) => {
    if (!inventoryId) return;
    setDeleteModal({ isOpen: true, inventoryId, inventoryName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.inventoryId) return;

    try {
      setIsLoading(true);
      await deleteInventory(deleteModal.inventoryId);
      setInventories(prev => prev.filter(inventory => inventory.id !== deleteModal.inventoryId));
      showToast('Inventory deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete inventory', 'error');
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

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search inventories by code, name, address, contact..."
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
                Inventory Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
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
            {paginatedInventories.map(inventory => (
              <tr key={inventory.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inventory.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inventory.name}</div>
                  {inventory.nameBn && (
                    <div className="text-sm text-gray-500">{inventory.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {inventory.address || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {inventory.responsiblePerson || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inventory.mobile && (
                    <div className="text-sm text-gray-900">{inventory.mobile}</div>
                  )}
                 
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={inventory.active || false} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={inventory.id}
                    itemName={inventory.name}
                    itemType="inventory"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedInventories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching inventories found" : "No inventories found"}
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
                href="/inventory/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first inventory
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
        itemName={deleteModal.inventoryName || "this inventory"}
        itemType="inventory"
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