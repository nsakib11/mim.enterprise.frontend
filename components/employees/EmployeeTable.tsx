"use client";

import { useState, useMemo } from "react";
import { Employee, EmploymentStatus, EmployeeType } from "@/utils/types";
import { deleteEmployee } from "@/utils/api";
import StatusBadge from "../StatusBadge";
import ActionsDropdown from "../ActionsDropdown";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Toast from "../Toast";
import Pagination from "../Pagination";
import TableControls from "../TableControl";
import Link from "next/link";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export default function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; employeeId?: number; employeeName?: string }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return employees.filter(employee => 
      employee.code.toLowerCase().includes(lowercasedSearch) ||
      employee.name.toLowerCase().includes(lowercasedSearch) ||
      (employee.nameBn && employee.nameBn.toLowerCase().includes(lowercasedSearch)) ||
      (employee.mobile && employee.mobile.toLowerCase().includes(lowercasedSearch)) ||
      (employee.email && employee.email.toLowerCase().includes(lowercasedSearch)) ||
      (employee.nidNumber && employee.nidNumber.toLowerCase().includes(lowercasedSearch)) ||
      (employee.shop?.name && employee.shop.name.toLowerCase().includes(lowercasedSearch)) ||
      (employee.costCenter?.name && employee.costCenter.name.toLowerCase().includes(lowercasedSearch)) ||
      employee.employeeType.toLowerCase().includes(lowercasedSearch) ||
      employee.employmentStatus.toLowerCase().includes(lowercasedSearch)
    );
  }, [employees, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get current page data
  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, startIndex, endIndex]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteClick = (employeeId?: number, employeeName?: string) => {
    if (!employeeId) return;
    setDeleteModal({ isOpen: true, employeeId, employeeName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.employeeId) return;

    try {
      setIsLoading(true);
      await deleteEmployee(deleteModal.employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== deleteModal.employeeId));
      showToast('Employee deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete employee', 'error');
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

  const getStatusBadge = (status: EmploymentStatus) => {
    const statusColors = {
      [EmploymentStatus.ACTIVE]: "bg-green-100 text-green-800",
      [EmploymentStatus.INACTIVE]: "bg-red-100 text-red-800",
      [EmploymentStatus.TERMINATED]: "bg-gray-100 text-gray-800",
      [EmploymentStatus.ON_LEAVE]: "bg-yellow-100 text-yellow-800"
    };
    
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getTypeBadge = (type: EmployeeType) => {
    const typeColors = {
      [EmployeeType.SALES_PERSON]: "bg-blue-100 text-blue-800",
      [EmployeeType.DRIVER]: "bg-purple-100 text-purple-800",
      [EmployeeType.LABOR]: "bg-orange-100 text-orange-800",
      [EmployeeType.OFFICER]: "bg-cyan-100 text-cyan-800",
      [EmployeeType.MANAGER]: "bg-indigo-100 text-indigo-800"
    };
    
    const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <TableControls
        onSearch={handleSearch}
        onItemsPerPageChange={handleItemsPerPageChange}
        searchPlaceholder="Search employees by code, name, mobile, NID, shop..."
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
                Employee Details
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
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
            {paginatedEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{emp.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                  {emp.nameBn && (
                    <div className="text-sm text-gray-500">{emp.nameBn}</div>
                  )}
                  {emp.joinDate && (
                    <div className="text-xs text-gray-400">
                      Joined: {formatDate(emp.joinDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTypeBadge(emp.employeeType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {emp.mobile && (
                    <div className="text-sm text-gray-900">{emp.mobile}</div>
                  )}
                  {emp.email && (
                    <div className="text-sm text-gray-500">{emp.email}</div>
                  )}
                  {emp.nidNumber && (
                    <div className="text-xs text-gray-400">NID: {emp.nidNumber}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {emp.shop?.name || "-"}
                  </div>
                  {emp.costCenter?.name && (
                    <div className="text-sm text-gray-500">{emp.costCenter.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="font-medium">{formatCurrency(emp.currentSalary)}</div>
                  {emp.basicSalary && emp.basicSalary !== emp.currentSalary && (
                    <div className="text-xs text-gray-500">
                      Basic: {formatCurrency(emp.basicSalary)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getStatusBadge(emp.employmentStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <ActionsDropdown 
                    itemId={emp.id}
                    itemName={emp.name}
                    itemType="employee"
                    onDeleteClick={handleDeleteClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedEmployees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching employees found" : "No employees found"}
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
                href="/employees/create" 
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first employee
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
        itemName={deleteModal.employeeName || "this employee"}
        itemType="employee"
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