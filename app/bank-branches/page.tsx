// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { BankBranch, Bank } from "@/utils/types";
// import { getBankBranches, deleteBankBranch, getBanks } from "@/utils/api";

// export default function BankBranchList() {
//   const [bankBranches, setBankBranches] = useState<BankBranch[]>([]);
//   const [banks, setBanks] = useState<Bank[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const [branchesData, banksData] = await Promise.all([
//         getBankBranches(),
//         getBanks()
//       ]);
//       setBankBranches(branchesData);
//       setBanks(banksData);
//     };
    
//     fetchData();
//   }, []);

//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     if (confirm("Are you sure you want to delete this bank branch?")) {
//       await deleteBankBranch(id);
//       setBankBranches(prev => prev.filter(branch => branch.id !== id));
//     }
//   };

//   const getStatusBadge = (active: boolean) => {
//     const statusColors = {
//       true: "bg-green-100 text-green-800",
//       false: "bg-red-100 text-red-800"
//     };
    
//     const colorClass = statusColors[active.toString() as keyof typeof statusColors];
//     const statusText = active ? "Active" : "Inactive";
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
//         {statusText}
//       </span>
//     );
//   };

//   const getBankName = (bankId?: number) => {
//     if (!bankId) return "-";
//     const bank = banks.find(b => b.id === bankId);
//     return bank ? bank.name : "-";
//   };

//   const getBankCode = (bankId?: number) => {
//     if (!bankId) return "";
//     const bank = banks.find(b => b.id === bankId);
//     return bank ? bank.code : "";
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Bank Branches</h1>
//         <Link 
//           href="/bank-branches/create" 
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//         >
//           Add Bank Branch
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Code
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Bank Details
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Branch Details
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact Person
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact Info
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Routing No
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {bankBranches.map(branch => (
//               <tr key={branch.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{branch.code}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {getBankName(branch.bank?.id)}
//                   </div>
//                   {getBankCode(branch.bank?.id) && (
//                     <div className="text-sm text-gray-500">{getBankCode(branch.bank?.id)}</div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{branch.name}</div>
//                   {branch.nameBn && (
//                     <div className="text-sm text-gray-500">{branch.nameBn}</div>
//                   )}
//                   {branch.address && (
//                     <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
//                       {branch.address}
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {branch.contactPersonName || "-"}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {branch.mobile && (
//                     <div className="text-sm text-gray-900">{branch.mobile}</div>
//                   )}
//                   {branch.email && (
//                     <div className="text-sm text-gray-500">{branch.email}</div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-mono text-gray-900">
//                     {branch.routingNo || "-"}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                   {getStatusBadge(branch.active)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
//                   <Link 
//                     href={`/bank-branches/${branch.id}`} 
//                     className="text-blue-600 hover:text-blue-900 transition-colors"
//                   >
//                     View
//                   </Link>
//                   <Link 
//                     href={`/bank-branches/${branch.id}/edit`} 
//                     className="text-green-600 hover:text-green-900 transition-colors"
//                   >
//                     Edit
//                   </Link>
//                   <button 
//                     onClick={() => handleDelete(branch.id)} 
//                     className="text-red-600 hover:text-red-900 transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {bankBranches.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-lg">No bank branches found</p>
//             <Link 
//               href="/bank-branches/create" 
//               className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
//             >
//               Add your first bank branch
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Summary Cards */}
//       {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Branches</h3>
//           <p className="text-3xl font-bold text-blue-600">{bankBranches.length}</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Branches</h3>
//           <p className="text-3xl font-bold text-green-600">
//             {bankBranches.filter(branch => branch.active).length}
//           </p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Unique Banks</h3>
//           <p className="text-3xl font-bold text-purple-600">
//             {new Set(bankBranches.map(branch => branch.bank?.id).filter(Boolean)).size}
//           </p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Branches with Email</h3>
//           <p className="text-3xl font-bold text-indigo-600">
//             {bankBranches.filter(branch => branch.email).length}
//           </p>
//         </div>
//       </div> */}

//       {/* Additional Statistics */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Branch Status Overview</h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-3 bg-green-100"></div>
//                 <span className="text-sm text-gray-700">Active Branches</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-medium text-gray-900">
//                   {bankBranches.filter(branch => branch.active).length}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-2">
//                   ({bankBranches.length > 0 ? ((bankBranches.filter(branch => branch.active).length / bankBranches.length) * 100).toFixed(1) : 0}%)
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-3 bg-red-100"></div>
//                 <span className="text-sm text-gray-700">Inactive Branches</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-medium text-gray-900">
//                   {bankBranches.filter(branch => !branch.active).length}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-2">
//                   ({bankBranches.length > 0 ? ((bankBranches.filter(branch => !branch.active).length / bankBranches.length) * 100).toFixed(1) : 0}%)
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-3 bg-blue-100"></div>
//                 <span className="text-sm text-gray-700">Branches with Contact Person</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-medium text-gray-900">
//                   {bankBranches.filter(branch => branch.contactPersonName).length}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-2">
//                   ({bankBranches.length > 0 ? ((bankBranches.filter(branch => branch.contactPersonName).length / bankBranches.length) * 100).toFixed(1) : 0}%)
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-3 bg-purple-100"></div>
//                 <span className="text-sm text-gray-700">Branches with Email</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-medium text-gray-900">
//                   {bankBranches.filter(branch => branch.email).length}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-2">
//                   ({bankBranches.length > 0 ? ((bankBranches.filter(branch => branch.email).length / bankBranches.length) * 100).toFixed(1) : 0}%)
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { BankBranch, Bank } from "@/utils/types";
import { getBankBranches, getBanks } from "@/utils/api";
import BankBranchTable from "@/app/components/BankBranchTable";
import StatisticsCards from "@/app/components/StatisticsCards";

export default async function BankBranchListPage() {
  // Server-side data fetching
  const [branchesData, banksData] = await Promise.all([
    getBankBranches(),
    getBanks()
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bank Branches</h1>
        <Link 
          href="/bank-branches/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Bank Branch
        </Link>
      </div>

      <BankBranchTable 
        initialBranches={branchesData} 
        initialBanks={banksData} 
      />
      
      <StatisticsCards branches={branchesData} />
    </div>
  );
}