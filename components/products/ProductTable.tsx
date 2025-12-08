"use client";

import { useState, useMemo } from "react";
import { Product } from "@/utils/types";
import { deleteProduct } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId?: number; productName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return products.filter(product => 
      product.code.toLowerCase().includes(lowercasedSearch) ||
      product.name.toLowerCase().includes(lowercasedSearch) ||
      (product.nameBn && product.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      (product.category && product.category.toLowerCase().includes(lowercasedSearch)) ||
      (product.supplier?.name && product.supplier.name.toLowerCase().includes(lowercasedSearch)) ||
      (product.supplier?.code && product.supplier.code.toLowerCase().includes(lowercasedSearch)) ||
      (product.unit?.name && product.unit.name.toLowerCase().includes(lowercasedSearch)) ||
      (product.unit?.nameBn && product.unit.nameBn.toLowerCase().includes(lowercasedSearch))
    );
  }, [products, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (productId?: number, productName?: string) => {
    if (!productId) return;
    setDeleteModal({ isOpen: true, productId, productName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.productId) return;

    try {
      setIsLoading(true);
      await deleteProduct(deleteModal.productId);
      setProducts(prev => prev.filter(product => product.id !== deleteModal.productId));
      showToast('Product deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete product', 'error');
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

  const getCategoryBadge = (category?: string) => {
    if (!category) return "-";
    
    const categoryColors = {
      "Building Material": "bg-blue-100 text-blue-800",
      "Hardware": "bg-orange-100 text-orange-800",
      "Board": "bg-green-100 text-green-800",
      "Electrical": "bg-purple-100 text-purple-800",
      "Plumbing": "bg-cyan-100 text-cyan-800"
    };
    
    const colorClass = categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search products by code, name, category, supplier..."
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
                Product Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
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
            {paginatedProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  {product.nameBn && (
                    <div className="text-sm text-gray-500">{product.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(product.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.supplier?.name || "-"}
                  </div>
                  {product.supplier?.code && (
                    <div className="text-sm text-gray-500">{product.supplier.code}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.unit?.name || "-"}
                  </div>
                  {product.unit?.nameBn && (
                    <div className="text-sm text-gray-500">{product.unit.nameBn}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <StatusBadge active={product.active || false} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={product.id}
                    itemName={product.name}
                    itemType="product"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching products found" : "No products found"}
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
                href="/products/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first product
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
        itemName={deleteModal.productName || "this product"}
        itemType="product"
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