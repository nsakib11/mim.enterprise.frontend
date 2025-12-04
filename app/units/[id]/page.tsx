import ViewUnitClient from "@/components/units/ViewUnitClient";
import { getUnit } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewUnitPage({ params }: PageProps) {
  const { id } = await params;
  const unitId = Number(id);
  
  // Fetch data on the server
  const unitData = await getUnit(unitId);

  // Pass data as props to the client component
  return <ViewUnitClient initialUnit={unitData} />;
}