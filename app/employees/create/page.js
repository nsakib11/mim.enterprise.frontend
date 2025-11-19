"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeType, EmploymentStatus } from "@/utils/types";
import { createEmployee, getShops, getCostCenters } from "@/utils/api";
import Link from "next/link";

export default function CreateEmployee() {
  const router = useRouter();
  const [employee, setEmployee] = useState({
    code: "",
    name: "",
    nameBn: "",
    employeeType: EmployeeType.SALES_PERSON,
    mobile: "",
    email: "",
    address: "",
    nidNumber: "",
    joinDate: "",
    dateOfBirth: "",
    basicSalary: 0,
    currentSalary: 0,
    shop: undefined,
    costCenter: undefined,
    employmentStatus: EmploymentStatus.ACTIVE,
    active: true,
  });

  const [shops, setShops] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  useEffect(() => {
    getShops().then(setShops);
    getCostCenters().then(setCostCenters);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "shop") setEmployee(prev => ({ ...prev, shop: shops.find(s => s.id === Number(value)) }));
    else if (name === "costCenter") setEmployee(prev => ({ ...prev, costCenter: costCenters.find(c => c.id === Number(value)) }));
    else setEmployee(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEmployee(employee);
    router.push("/employees");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Employee</h1>
              <p className="mt-2 text-sm text-gray-600">
                Add a new employee to your system. Fill in all the required information below.
              </p>
            </div>
            <Link
              href="/employees"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Go to List
            </Link>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(EmployeeType).map(type => <option key={type} value={type}>{type}</option>)}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {Object.values(EmploymentStatus).map(status => <option key={status} value={status}>{status}</option>)}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Shop</option>
                    {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Cost Center</option>
                    {costCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                    onChange={handleChange}
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
                      onChange={handleChange}
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
               
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Create Employee
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
              <h3 className="text-sm font-medium text-blue-800">Quick Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Employee codes should be unique for identification</li>
                  <li>Provide accurate personal and contact information</li>
                  <li>Select appropriate employee type and employment status</li>
                  <li>Assign to relevant shop and cost center for proper management</li>
                  <li>Include complete address for official records</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}