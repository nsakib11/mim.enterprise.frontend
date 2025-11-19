"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CostCenter } from "@/utils/types";
import { getCostCenter } from "@/utils/api";
import Link from "next/link";

export default function ViewCostCenter() {
  const params = useParams();
  const id = Number(params.id);
  const [costCenter, setCostCenter] = useState<CostCenter | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCostCenter(id);
      setCostCenter(data);
    };
    fetch();
  }, [id]);

  if (!costCenter) return <div className="p-6 text-gray-400">Loading...</div>;

  const infoItems = [
    { label: "Code", value: costCenter.code },
    { label: "Name", value: costCenter.name },
    { label: "Name (Bn)", value: costCenter.nameBn },
    { label: "Type", value: costCenter.costCenterType },
    { label: "Active", value: costCenter.active ? "Yes" : "No" },
  ];

  return (
 <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Cost-Center Details</h1>
        <Link 
          href="/cost-center" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Go to List
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map(item => (
          <div key={item.label} className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
            <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
            <p className="text-gray-800 font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
