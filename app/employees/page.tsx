"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Employee, EmploymentStatus, EmployeeType } from "@/utils/types";
import { getEmployees, deleteEmployee } from "@/utils/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);

 

  useEffect(() => {
     const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };
    fetchEmployees();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
          setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link 
          href="/employees/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            {employees.map(emp => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                  <Link 
                    href={`/employees/${emp.id}`} 
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/employees/${emp.id}/edit`} 
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(emp.id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {employees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No employees found</p>
            <Link 
              href="/employees/create" 
              className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
            >
              Add your first employee
            </Link>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Employees</h3>
          <p className="text-3xl font-bold text-green-600">
            {employees.filter(emp => emp.employmentStatus === EmploymentStatus.ACTIVE).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Employee Types</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(employees.map(emp => emp.employeeType)).size}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Monthly Salary</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(employees.reduce((sum, emp) => sum + (emp.currentSalary || 0), 0))}
          </p>
        </div>
      </div>
    </div>
  );
}