import ViewInventoryClient from "@/components/inventory/ViewInventoryClient";
import { getInventory } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewInventoryPage({ params }: PageProps) {
  const { id } = await params;
  const inventoryId = Number(id);
  
  // Fetch data on the server
  const inventoryData = await getInventory(inventoryId);

  // Pass data as props to the client component
  return <ViewInventoryClient initialInventory={inventoryData} />;
}