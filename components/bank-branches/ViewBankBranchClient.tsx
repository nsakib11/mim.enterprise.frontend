"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BankBranch, Bank } from "@/utils/types";
import { getBankBranch, getBanks } from "@/utils/api";
import Link from "next/link";

interface ViewBankBranchClientProps {
  initialBranch: BankBranch;
  initialBanks: Bank[];
}

export default function ViewBankBranchClient({ 
  initialBranch, 
  initialBanks 
}: ViewBankBranchClientProps) {
  const params = useParams();
  const router = useRouter();
  const branchId = Number(params.id);
  const [branch, setBranch] = useState<BankBranch | null>(initialBranch);
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [loading, setLoading] = useState(!initialBranch);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialBranch || initialBranch.id !== branchId;
    
    if (shouldRefetch) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [branchData, banksData] = await Promise.all([
            getBankBranch(branchId),
            getBanks()
          ]);
          setBranch(branchData);
          setBanks(banksData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [branchId, initialBranch]);

  const handleEdit = () => {
    router.push(`/bank-branches/${branchId}/edit`);
  };

  if (loading || !branch) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const getBankName = (bankId?: number) => {
    if (!bankId) return "-";
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : "-";
  };

  const infoItems = [
    { label: "Code", value: branch.code },
    { label: "Bank", value: getBankName(branch.bank?.id) },
    { label: "Name", value: branch.name },
    { label: "Name (Bn)", value: branch.nameBn },
    { label: "Address", value: branch.address },
    { label: "Contact Person Name", value: branch.contactPersonName },
    { label: "Mobile", value: branch.mobile },
    { label: "Email", value: branch.email },
    { label: "Routing No", value: branch.routingNo },
    { label: "Active", value: branch.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Branch Details</h1>
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
            href="/bank-branches" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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