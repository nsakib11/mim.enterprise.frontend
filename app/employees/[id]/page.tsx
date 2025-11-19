"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Employee } from "@/utils/types";
import { getEmployee } from "@/utils/api";
import Link from "next/link";

export default function ViewEmployee() {
  const params = useParams();
  const employeeId = Number(params.id);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    getEmployee(employeeId).then(setEmployee);
  }, [employeeId]);

  if (!employee) return <div className="p-6 text-center text-gray-400">Loading...</div>;

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
        <Link 
          href="/employees" 
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