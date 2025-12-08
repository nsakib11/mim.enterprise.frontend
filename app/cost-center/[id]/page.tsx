import ViewCostCenterClient from "@/components/cost-centers/ViewCostCenterClient";
import { getCostCenter } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCostCenterPage({ params }: PageProps) {
  const { id } = await params;
  const costCenterId = Number(id);
  
  // Fetch data on the server
  const costCenterData = await getCostCenter(costCenterId);

  // Pass data as props to the client component
  return <ViewCostCenterClient initialCostCenter={costCenterData} />;
}