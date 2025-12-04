"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Unit } from "@/utils/types";
import { getUnit } from "@/utils/api";
import Link from "next/link";

interface ViewUnitClientProps {
  initialUnit: Unit;
}

export default function ViewUnitClient({ initialUnit }: ViewUnitClientProps) {
  const params = useParams();
  const router = useRouter();
  const unitId = Number(params.id);
  const [unit, setUnit] = useState<Unit | null>(initialUnit);
  const [loading, setLoading] = useState(!initialUnit);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialUnit || initialUnit.id !== unitId;
    
    if (shouldRefetch) {
      const fetchUnit = async () => {
        setLoading(true);
        try {
          const data = await getUnit(unitId);
          setUnit(data);
        } catch (error) {
          console.error("Failed to fetch unit:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUnit();
    }
  }, [unitId, initialUnit]);

  const handleEdit = () => {
    router.push(`/units/${unitId}/edit`);
  };

  if (loading || !unit) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const infoItems = [
    { label: "Name", value: unit.name },
    { label: "Name (Bn)", value: unit.nameBn },
    { label: "Active", value: unit.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Unit Details</h1>
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
            href="/units" 
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