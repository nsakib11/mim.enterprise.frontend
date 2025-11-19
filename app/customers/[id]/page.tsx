"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Customer } from "@/utils/types";
import { getCustomer } from "@/utils/api";
import Link from "next/link";

export default function ViewCustomer() {
  const params = useParams();
  const customerId = Number(params.id);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const data = await getCustomer(customerId);
      setCustomer(data);
    };
    fetchCustomer();
  }, [customerId]);

  if (!customer) return <div className="p-6 text-center text-gray-400">Loading...</div>;

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
        <Link 
          href="/customers" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Go to List
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map(item => (
          <div
            key={item.label}
            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
            <p className="text-gray-800 font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}