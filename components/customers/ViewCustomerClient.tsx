"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Customer } from "@/utils/types";
import { getCustomer } from "@/utils/api";
import Link from "next/link";

interface ViewCustomerClientProps {
  initialCustomer: Customer;
}

export default function ViewCustomerClient({ initialCustomer }: ViewCustomerClientProps) {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);
  const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
  const [loading, setLoading] = useState(!initialCustomer);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialCustomer || initialCustomer.id !== customerId;
    
    if (shouldRefetch) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const data = await getCustomer(customerId);
          setCustomer(data);
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [customerId, initialCustomer]);

  const handleEdit = () => {
    router.push(`/customers/${customerId}/edit`);
  };

  if (loading || !customer) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const infoItems = [
    { label: "Code", value: customer.code },
    { label: "Name", value: customer.name },
    { label: "Name (Bn)", value: customer.nameBn },
    { label: "Customer Type", value: customer.customerType },
    { label: "Mobile", value: customer.mobile },
    { label: "Email", value: customer.email },
    { label: "Address", value: customer.address },
    { label: "Active", value: customer.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Customer Details</h1>
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <Link 
            href="/customers" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map(item => (
          <div
            key={item.label}
            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
            <p className="text-gray-800 font-semibold mt-1">{item.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}