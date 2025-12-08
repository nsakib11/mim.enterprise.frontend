"use client";

import { useState, useMemo } from "react";
import { Supplier } from "@/utils/types";
import { deleteSupplier } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface SupplierTableProps {
  initialSuppliers: Supplier[];
}

export default function SupplierTable({ initialSuppliers }: SupplierTableProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; supplierId?: number; supplierName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliers;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.code.toLowerCase().includes(lowercasedSearch) ||
      supplier.name.toLowerCase().includes(lowercasedSearch) ||
      (supplier.nameBn && supplier.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      supplier.supplierProduct.toLowerCase().includes(lowercasedSearch) ||
      supplier.supplierType.toLowerCase().includes(lowercasedSearch) ||
      supplier.responsiblePerson.toLowerCase().includes(lowercasedSearch) ||
      supplier.mobile.toLowerCase().includes(lowercasedSearch) ||
      (supplier.telephone && supplier.telephone.toLowerCase().includes(lowercasedSearch))
    );
  }, [suppliers, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedSuppliers = useMemo(() => {
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (supplierId?: number, supplierName?: string) => {
    if (!supplierId) return;
    setDeleteModal({ isOpen: true, supplierId, supplierName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.supplierId) return;

    try {
      setIsLoading(true);
      await deleteSupplier(deleteModal.supplierId);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== deleteModal.supplierId));
      showToast('Supplier deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete supplier', 'error');
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

  const getTypeBadge = (type: string) => {
    const typeColors = {
      "CREDIT_PURCHASE": "bg-blue-100 text-blue-800",
      "NON_CREDIT_PURCHASE": "bg-purple-100 text-purple-800"
    };
    
    const colorClass = typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  const getProductBadge = (product: string) => {
    const productColors = {
      "BOARD": "bg-orange-100 text-orange-800",
      "HARDWARE": "bg-cyan-100 text-cyan-800",
      "BOARD_HARDWARE": "bg-indigo-100 text-indigo-800"
    };
    
    const colorClass = productColors[product as keyof typeof productColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {product.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search suppliers by code, name, contact, product type..."
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
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
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
            {paginatedSuppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{supplier.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                  {supplier.nameBn && (
                    <div className="text-sm text-gray-500">{supplier.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getProductBadge(supplier.supplierProduct)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTypeBadge(supplier.supplierType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.responsiblePerson}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.mobile}</div>
                  {supplier.telephone && (
                    <div className="text-sm text-gray-500">{supplier.telephone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={supplier.isActive} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={supplier.id}
                    itemName={supplier.name}
                    itemType="supplier"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedSuppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching suppliers found" : "No suppliers found"}
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
                href="/suppliers/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first supplier
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
        itemName={deleteModal.supplierName || "this supplier"}
        itemType="suppliers"
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