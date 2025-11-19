"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shop } from "@/utils/types";
import { createShop } from "@/utils/api";
import Link from "next/link";

export default function CreateShop() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop>({
    code: "",
    name: "",
    nameBn: "",
    address: "",
    monthlySalesTarget: 0,
    yearlySalesTarget: 0,
    shopRent: 0,
    entertainmentBudget: 0,
    pettyCashLimit: 0,
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setShop(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value === "" ? "" : Number(value) || value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createShop(shop);
      router.push("/shops");
    } catch (error) {
      console.error('Error creating shop:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Shop</h1>
              <p className="mt-2 text-sm text-gray-600">
                Add a new shop to your system. Fill in all the required information below.
              </p>
            </div>
            <Link
              href="/shops"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back to Shops
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={shop.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter shop code"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shop.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter shop name"
                    required
                  />
                </div>

                {/* Name (Bengali) */}
                <div>
                  <label htmlFor="nameBn" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name (Bengali)
                  </label>
                  <input
                    type="text"
                    id="nameBn"
                    name="nameBn"
                    value={shop.nameBn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="দোকানের নাম লিখুন"
                  />
                </div>

                {/* Monthly Sales Target */}
                <div>
                  <label htmlFor="monthlySalesTarget" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Sales Target
                  </label>
                  <input
                    type="number"
                    id="monthlySalesTarget"
                    name="monthlySalesTarget"
                    value={shop.monthlySalesTarget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Yearly Sales Target */}
                <div>
                  <label htmlFor="yearlySalesTarget" className="block text-sm font-medium text-gray-700 mb-2">
                    Yearly Sales Target
                  </label>
                  <input
                    type="number"
                    id="yearlySalesTarget"
                    name="yearlySalesTarget"
                    value={shop.yearlySalesTarget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Shop Rent */}
                <div>
                  <label htmlFor="shopRent" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Rent
                  </label>
                  <input
                    type="number"
                    id="shopRent"
                    name="shopRent"
                    value={shop.shopRent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Entertainment Budget */}
                <div>
                  <label htmlFor="entertainmentBudget" className="block text-sm font-medium text-gray-700 mb-2">
                    Entertainment Budget
                  </label>
                  <input
                    type="number"
                    id="entertainmentBudget"
                    name="entertainmentBudget"
                    value={shop.entertainmentBudget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Petty Cash Limit */}
                <div>
                  <label htmlFor="pettyCashLimit" className="block text-sm font-medium text-gray-700 mb-2">
                    Petty Cash Limit
                  </label>
                  <input
                    type="number"
                    id="pettyCashLimit"
                    name="pettyCashLimit"
                    value={shop.pettyCashLimit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shop.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter shop address"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={shop.active}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Active Shop
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Active shops will be available for sales and employee assignments.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
              <div className="flex justify-end space-x-3">
              
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Shop'
                  )}
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
              <h3 className="text-sm font-medium text-blue-800">Shop Setup Guide</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Shop codes should be unique for easy identification</li>
                  <li>Provide clear and descriptive shop names</li>
                  <li>Set realistic sales targets for performance tracking</li>
                  <li>Include complete address for location reference</li>
                  <li>Configure budgets and limits for financial management</li>
                  <li>Keep shops active to make them available for operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}