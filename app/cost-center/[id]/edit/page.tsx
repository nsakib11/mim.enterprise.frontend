"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CostCenter, CostCenterType } from "@/utils/types";
import { getCostCenter, updateCostCenter } from "@/utils/api";
import Link from "next/link";

export default function EditCostCenter() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [costCenter, setCostCenter] = useState<CostCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCostCenter(id);
        setCostCenter(data);
      } catch (error) {
        console.error("Failed to fetch cost center:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCostCenter(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCostCenter(prev => prev ? { ...prev, [name]: checked } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!costCenter) return;
    await updateCostCenter(id, costCenter);
    router.push("/cost-centers");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cost center details...</p>
        </div>
      </div>
    );
  }

  if (!costCenter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Cost Center not found</h3>
        
          <div className="mt-6">
            <Link
              href="/cost-centers"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Cost Centers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Cost Center</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update the cost center information below. Make sure all changes are accurate.
              </p>
            </div>
          
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              {/* Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Center Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={costCenter.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter cost center code"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={costCenter.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter cost center name"
                  required
                />
              </div>

              {/* NameBn */}
              <div>
                <label htmlFor="nameBn" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Center Name (Bengali)
                </label>
                <input
                  type="text"
                  id="nameBn"
                  name="nameBn"
                  value={costCenter.nameBn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="খরচ কেন্দ্রের নাম লিখুন"
                />
              </div>

              {/* Cost Center Type */}
              <div>
                <label htmlFor="costCenterType" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Center Type
                </label>
                <select
                  id="costCenterType"
                  name="costCenterType"
                  value={costCenter.costCenterType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  {Object.values(CostCenterType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={costCenter.active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active Cost Center
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/cost-center"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                >
                  Update Cost Center
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
              <h3 className="text-sm font-medium text-blue-800">Editing Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure cost center codes remain unique after changes</li>
                  <li>Update both English and Bengali names for consistency</li>
                  <li>Choose appropriate cost center type for proper categorization</li>
                  <li>Deactivate cost centers that are no longer in use</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}