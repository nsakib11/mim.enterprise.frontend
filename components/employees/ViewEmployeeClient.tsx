"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Employee } from "@/utils/types";
import { getEmployee } from "@/utils/api";
import Link from "next/link";

interface ViewEmployeeClientProps {
  initialEmployee: Employee;
}

export default function ViewEmployeeClient({ initialEmployee }: ViewEmployeeClientProps) {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  const [employee, setEmployee] = useState<Employee | null>(initialEmployee);
  const [loading, setLoading] = useState(!initialEmployee);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialEmployee || initialEmployee.id !== employeeId;
    
    if (shouldRefetch) {
      const fetchEmployee = async () => {
        setLoading(true);
        try {
          const data = await getEmployee(employeeId);
          setEmployee(data);
        } catch (error) {
          console.error("Failed to fetch employee:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [employeeId, initialEmployee]);

  const handleEdit = () => {
    router.push(`/employees/${employeeId}/edit`);
  };

  if (loading || !employee) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const infoItems = [
    { label: "Code", value: employee.code },
    { label: "Name", value: employee.name },
    { label: "Name (Bn)", value: employee.nameBn },
    { label: "Employee Type", value: employee.employeeType },
    { label: "Mobile", value: employee.mobile },
    { label: "Email", value: employee.email },
    { label: "Address", value: employee.address },
    { label: "NID Number", value: employee.nidNumber },
    { label: "Join Date", value: employee.joinDate },
    { label: "Date of Birth", value: employee.dateOfBirth },
    { label: "Basic Salary", value: employee.basicSalary },
    { label: "Current Salary", value: employee.currentSalary },
    { label: "Shop", value: employee.shop?.name || "-" },
    { label: "Cost Center", value: employee.costCenter?.name || "-" },
    { label: "Employment Status", value: employee.employmentStatus },
    { label: "Active", value: employee.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Employee Details</h1>
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
            href="/employees" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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