"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Shop } from "@/utils/types";
import { getShop, updateShop } from "@/utils/api";
import Link from "next/link";

export default function EditShop() {
  const router = useRouter();
  const params = useParams();
  const shopId = Number(params.id);

  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setIsLoading(true);
        const data = await getShop(shopId);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setShop(prev =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value === "" ? "" : Number(value) || value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    
    try {
      setIsSubmitting(true);
      await updateShop(shopId, shop);
      router.push("/shops");
    } catch (error) {
      console.error('Error updating shop:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shop data...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Shop not found</h3>
       
          <div className="mt-6">
            <Link
              href="/shops"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Shops
            </Link>
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Shop</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update shop information. Make changes to the fields below as needed.
              </p>
              <p className="mt-1 text-sm text-blue-600 font-medium">
                Shop Code: {shop.code}
              </p>
            </div>
           
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
                <Link
                  href="/shops"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Shop'
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
              <h3 className="text-sm font-medium text-blue-800">Update Guidelines</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure all information is accurate before saving changes</li>
                  <li>Shop code and name are required fields</li>
                  <li>Update sales targets to reflect current business goals</li>
                  <li>Adjust budgets and limits according to financial planning</li>
                  <li>Deactivate shops that are no longer in operation</li>
                  <li>Review address information for accurate location tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}