"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Employee, EmployeeType, EmploymentStatus, Shop, CostCenter } from "@/utils/types";
import { getEmployee, updateEmployee, getShops, getCostCenters } from "@/utils/api";
import Link from "next/link";

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();
  const employeeId = Number(params.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [empData, shopData, ccData] = await Promise.all([
          getEmployee(employeeId),
          getShops(),
          getCostCenters(),
        ]);
        setEmployee(empData);
        setShops(shopData);
        setCostCenters(ccData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEmployee(prev => prev ? { ...prev, [name]: checked } : prev);
    } else {
      setEmployee(prev => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => prev ? { ...prev, [name]: parseFloat(value) || 0 } : prev);
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shopId = Number(e.target.value);
    const selectedShop = shops.find(s => s.id === shopId);
    setEmployee(prev => prev ? { ...prev, shop: selectedShop } as Employee : prev);
  };

  const handleCostCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const costCenterId = Number(e.target.value);
    const selectedCostCenter = costCenters.find(c => c.id === costCenterId);
    setEmployee(prev => prev ? { ...prev, costCenter: selectedCostCenter } as Employee : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    
    try {
      await updateEmployee(employeeId, employee);
      router.push("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Employee not found</h3>
         
          <div className="mt-6">
          
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update employee information. Make changes to the fields below as needed.
              </p>
            </div>
           
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={employee.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter employee code"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={employee.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                {/* NameBn */}
                <div>
                  <label htmlFor="nameBn" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name (Bengali)
                  </label>
                  <input
                    type="text"
                    id="nameBn"
                    name="nameBn"
                    value={employee.nameBn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="কর্মচারীর নাম লিখুন"
                  />
                </div>

                {/* Employee Type */}
                <div>
                  <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Type
                  </label>
                  <select
                    id="employeeType"
                    name="employeeType"
                    value={employee.employeeType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(EmployeeType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={employee.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter mobile number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={employee.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter email address"
                  />
                </div>

                {/* NID Number */}
                <div>
                  <label htmlFor="nidNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    NID Number
                  </label>
                  <input
                    type="text"
                    id="nidNumber"
                    name="nidNumber"
                    value={employee.nidNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter NID number"
                  />
                </div>

                {/* Join Date */}
                <div>
                  <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date
                  </label>
                  <input
                    type="date"
                    id="joinDate"
                    name="joinDate"
                    value={employee.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={employee.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>

                {/* Basic Salary */}
                <div>
                  <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basicSalary"
                    name="basicSalary"
                    value={employee.basicSalary}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Current Salary */}
                <div>
                  <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Salary
                  </label>
                  <input
                    type="number"
                    id="currentSalary"
                    name="currentSalary"
                    value={employee.currentSalary}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Employment Status */}
                <div>
                  <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={employee.employmentStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(EmploymentStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Shop */}
                <div>
                  <label htmlFor="shop" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop
                  </label>
                  <select
                    id="shop"
                    name="shop"
                    value={employee.shop?.id || ""}
                    onChange={handleShopChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Shop</option>
                    {shops.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cost Center */}
                <div>
                  <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Center
                  </label>
                  <select
                    id="costCenter"
                    name="costCenter"
                    value={employee.costCenter?.id || ""}
                    onChange={handleCostCenterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Cost Center</option>
                    {costCenters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-3">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={employee.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter employee address"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={employee.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Active Employee
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/employees"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                >
                  Update Employee
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Update Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure all information is accurate before saving changes</li>
                  <li>Employee code and name are required fields</li>
                  <li>Salary updates will be reflected in the next payroll cycle</li>
                  <li>Changing employment status may affect system access</li>
                  <li>Review shop and cost center assignments for proper reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}