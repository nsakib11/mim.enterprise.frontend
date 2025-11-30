"use client";

import { useMemo } from "react";
import { BankBranch } from "@/utils/types";

interface StatisticsCardsProps {
  branches: BankBranch[];
}

export default function StatisticsCards({ branches }: StatisticsCardsProps) {
  const stats = useMemo(() => {
    const activeBranches = branches.filter(branch => branch.active).length;
    const inactiveBranches = branches.filter(branch => !branch.active).length;
    const branchesWithContactPerson = branches.filter(branch => branch.contactPersonName).length;
    const branchesWithEmail = branches.filter(branch => branch.email).length;
    const totalBranches = branches.length;

    return {
      activeBranches,
      inactiveBranches,
      branchesWithContactPerson,
      branchesWithEmail,
      totalBranches,
      activePercentage: totalBranches > 0 ? (activeBranches / totalBranches) * 100 : 0,
      inactivePercentage: totalBranches > 0 ? (inactiveBranches / totalBranches) * 100 : 0,
      contactPercentage: totalBranches > 0 ? (branchesWithContactPerson / totalBranches) * 100 : 0,
      emailPercentage: totalBranches > 0 ? (branchesWithEmail / totalBranches) * 100 : 0,
    };
  }, [branches]);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Branch Status Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
              <span className="text-sm text-gray-700">Active Branches</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {stats.activeBranches}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({stats.activePercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
              <span className="text-sm text-gray-700">Inactive Branches</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {stats.inactiveBranches}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({stats.inactivePercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-blue-100"></div>
              <span className="text-sm text-gray-700">Branches with Contact Person</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {stats.branchesWithContactPerson}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({stats.contactPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3 bg-purple-100"></div>
              <span className="text-sm text-gray-700">Branches with Email</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {stats.branchesWithEmail}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({stats.emailPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}