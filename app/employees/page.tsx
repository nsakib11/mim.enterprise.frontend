import Link from "next/link";
import { Employee } from "@/utils/types";
import { getEmployees } from "@/utils/api";
import EmployeeTable from "@/components/employees/EmployeeTable";
import StatisticsCards from "@/components/employees/StatisticsCards";

export default async function EmployeeListPage() {
  // Server-side data fetching
  const employeesData = await getEmployees();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link 
          href="/employees/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Employee
        </Link>
      </div>

      <EmployeeTable initialEmployees={employeesData} />
      <StatisticsCards employees={employeesData} />
    </div>
  );
}