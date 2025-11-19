"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Inventory } from "@/utils/types";
import { getInventory } from "@/utils/api";
import Link from "next/link";

export default function ViewInventory() {
  const params = useParams();
  const inventoryId = Number(params.id);
  const [inventory, setInventory] = useState<Inventory | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const data = await getInventory(inventoryId);
      setInventory(data);
    };
    fetchInventory();
  }, [inventoryId]);

  if (!inventory) return <div className="p-6 text-center text-gray-400">Loading...</div>;

  const infoItems = [
    { label: "Code", value: inventory.code },
    { label: "Name", value: inventory.name },
    { label: "Name (Bn)", value: inventory.nameBn },
    { label: "Address", value: inventory.address },
    { label: "Responsible Person", value: inventory.responsiblePerson },
    { label: "Mobile", value: inventory.mobile },
    { label: "Active", value: inventory.active ? "Yes" : "No" },
  ];

  return (
     <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Inventory Details</h1>
        <Link 
          href="/inventory" 
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