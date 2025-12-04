"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Supplier } from "@/utils/types";
import { getSupplier } from "@/utils/api";
import Link from "next/link";

interface ViewSupplierClientProps {
  initialSupplier: Supplier;
}

export default function ViewSupplierClient({ initialSupplier }: ViewSupplierClientProps) {
  const params = useParams();
  const router = useRouter();
  const supplierId = Number(params.id);
  const [supplier, setSupplier] = useState<Supplier | null>(initialSupplier);
  const [loading, setLoading] = useState(!initialSupplier);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialSupplier || initialSupplier.id !== supplierId;
    
    if (shouldRefetch) {
      const fetchSupplier = async () => {
        setLoading(true);
        try {
          const data = await getSupplier(supplierId);
          setSupplier(data);
        } catch (error) {
          console.error("Failed to fetch supplier:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSupplier();
    }
  }, [supplierId, initialSupplier]);

  const handleEdit = () => {
    router.push(`/suppliers/${supplierId}/edit`);
  };

  if (loading || !supplier) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

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
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Supplier Details</h1>
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
            href="/suppliers" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoItems.map(item => (
          <div
            key={item.label}
            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
            <p className="text-gray-800 font-semibold mt-1 text-lg">{item.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}