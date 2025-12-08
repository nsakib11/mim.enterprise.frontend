"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CostCenter } from "@/utils/types";
import { getCostCenter } from "@/utils/api";
import Link from "next/link";

interface ViewCostCenterClientProps {
  initialCostCenter: CostCenter;
}

export default function ViewCostCenterClient({ initialCostCenter }: ViewCostCenterClientProps) {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [costCenter, setCostCenter] = useState<CostCenter | null>(initialCostCenter);
  const [loading, setLoading] = useState(!initialCostCenter);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialCostCenter || initialCostCenter.id !== id;
    
    if (shouldRefetch) {
      const fetchCostCenter = async () => {
        setLoading(true);
        try {
          const data = await getCostCenter(id);
          setCostCenter(data);
        } catch (error) {
          console.error("Failed to fetch cost center:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCostCenter();
    }
  }, [id, initialCostCenter]);

  const handleEdit = () => {
    router.push(`/cost-center/${id}/edit`);
  };

  if (loading || !costCenter) {
    return <div className="p-6 text-gray-400">Loading...</div>;
  }

  const infoItems = [
    { label: "Code", value: costCenter.code },
    { label: "Name", value: costCenter.name },
    { label: "Name (Bangla)", value: costCenter.nameBn },
    { label: "Type", value: costCenter.costCenterType },
    { label: "Active", value: costCenter.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Cost Center Details</h1>
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
            href="/cost-center" 
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