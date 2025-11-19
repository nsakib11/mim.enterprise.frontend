"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Supplier } from "@/utils/types";
import { getSupplier } from "@/utils/api";
import Link from "next/link";

export default function ViewSupplier() {
  const params = useParams();
  const supplierId = Number(params.id);
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      const data = await getSupplier(supplierId);
      setSupplier(data);
    };
    fetchSupplier();
  }, [supplierId]);

  if (!supplier) return <div className="p-6 text-center text-gray-400">Loading...</div>;

  const infoItems = [
    { label: "Code", value: supplier.code },
    { label: "Name", value: supplier.name },
    { label: "Name (Bn)", value: supplier.nameBn },
    { label: "Supplier Product", value: supplier.supplierProduct },
    { label: "Supplier Type", value: supplier.supplierType },
    { label: "Responsible Person", value: supplier.responsiblePerson },
    { label: "Mobile", value: supplier.mobile },
    { label: "Telephone", value: supplier.telephone },
    { label: "Email", value: supplier.email },
    { label: "Website", value: supplier.website },
    { label: "Address", value: supplier.address },
    { label: "Active", value: supplier.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Supplier Details</h1>
        <Link 
          href="/suppliers" 
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