"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Shop } from "@/utils/types";
import { getShop } from "@/utils/api";
import Link from "next/link";

export default function ViewShop() {
  const params = useParams();
  const shopId = Number(params.id);
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      const data = await getShop(shopId);
      setShop(data);
    };
    fetchShop();
  }, [shopId]);

  if (!shop) return <div className="p-6 text-center text-gray-400">Loading...</div>;

  const infoItems = [
    { label: "Code", value: shop.code },
    { label: "Name", value: shop.name },
    { label: "Address", value: shop.address },
    { label: "Monthly Sales Target", value: shop.monthlySalesTarget },
    { label: "Yearly Sales Target", value: shop.yearlySalesTarget },
    { label: "Shop Rent", value: shop.shopRent },
    { label: "Entertainment Budget", value: shop.entertainmentBudget },
    { label: "Petty Cash Limit", value: shop.pettyCashLimit },
    { label: "Active", value: shop.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Shop Details</h1>
        <Link 
          href="/shops" 
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
