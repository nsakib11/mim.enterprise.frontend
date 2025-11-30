// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Bank } from "@/utils/types";
// import { getBanks, deleteBank } from "@/utils/api";

// export default function BankList() {
//   const [banks, setBanks] = useState<Bank[]>([]);

 

//   useEffect(() => {
//      const fetchBanks = async () => {
//     const data = await getBanks();
//     setBanks(data);
//   };
//     fetchBanks();
//   }, []);

//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     if (confirm("Are you sure you want to delete this bank?")) {
//       await deleteBank(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
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

//   const formatWebsite = (website: string) => {
//     if (!website) return "-";
//     // Remove protocol for display
//     const displayUrl = website.replace(/^https?:\/\//, '');
//     return (
//       <a 
//         href={website.startsWith('http') ? website : `https://${website}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//       >
//         {displayUrl}
//       </a>
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Banks</h1>
//         <Link 
//           href="/banks/create" 
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//         >
//           Add Bank
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
//                 Head Office Address
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Website
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
//             {banks.map(bank => (
//               <tr key={bank.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{bank.code}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{bank.name}</div>
//                   {bank.nameBn && (
//                     <div className="text-sm text-gray-500">{bank.nameBn}</div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="text-sm text-gray-900 max-w-xs">
//                     {bank.headOfficeAddress || "-"}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {formatWebsite(bank.website || '')}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                   {getStatusBadge(bank.active)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
//                   <Link 
//                     href={`/banks/${bank.id}`} 
//                     className="text-blue-600 hover:text-blue-900 transition-colors"
//                   >
//                     View
//                   </Link>
//                   <Link 
//                     href={`/banks/${bank.id}/edit`} 
//                     className="text-green-600 hover:text-green-900 transition-colors"
//                   >
//                     Edit
//                   </Link>
//                   <button 
//                     onClick={() => handleDelete(bank.id)} 
//                     className="text-red-600 hover:text-red-900 transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {banks.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-lg">No banks found</p>
//             <Link 
//               href="/banks/create" 
//               className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
//             >
//               Add your first bank
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Summary Cards */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Banks</h3>
//           <p className="text-3xl font-bold text-blue-600">{banks.length}</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Banks</h3>
//           <p className="text-3xl font-bold text-green-600">
//             {banks.filter(bank => bank.active).length}
//           </p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Banks with Website</h3>
//           <p className="text-3xl font-bold text-purple-600">
//             {banks.filter(bank => bank.website).length}
//           </p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Inactive Banks</h3>
//           <p className="text-3xl font-bold text-red-600">
//             {banks.filter(bank => !bank.active).length}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { Bank } from "@/utils/types";
import { getBanks } from "@/utils/api";
import BankTable from "@/components/banks/BankTable";
import StatisticsCards from "@/components/banks/StatisticsCards";

export default async function BankListPage() {
  // Server-side data fetching
  const banksData = await getBanks();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banks</h1>
        <Link 
          href="/banks/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Bank
        </Link>
      </div>

      <BankTable initialBanks={banksData} />
      <StatisticsCards banks={banksData} />
    </div>
  );
}