import ViewEmployeeClient from "@/components/employees/ViewEmployeeClient";
import { getEmployee } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewEmployeePage({ params }: PageProps) {
  const { id } = await params;
  const employeeId = Number(id);
  
  // Fetch data on the server
  const employeeData = await getEmployee(employeeId);

  // Pass data as props to the client component
  return <ViewEmployeeClient initialEmployee={employeeData} />;
}