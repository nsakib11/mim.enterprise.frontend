
import Link from "next/link";
import { Customer } from "@/utils/types";
import { getCustomers } from "@/utils/api";
import CustomerTable from "@/components/customers/CustomerTable";
import StatisticsCards from "@/components/customers/StatisticsCards";

export default async function CustomerListPage() {
  // Server-side data fetching
  const customersData = await getCustomers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <Link 
          href="/customers/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Customer
        </Link>
      </div>

      <CustomerTable initialCustomers={customersData} />
      <StatisticsCards customers={customersData} />
    </div>
  );
}