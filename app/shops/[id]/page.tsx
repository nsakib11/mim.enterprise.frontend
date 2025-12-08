import ViewShopClient from "@/components/shops/ViewShopClient";
import { getShop } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewShopPage({ params }: PageProps) {
  const { id } = await params;
  const shopId = Number(id);
  
  // Fetch data on the server
  const shopData = await getShop(shopId);

  // Pass data as props to the client component
  return <ViewShopClient initialShop={shopData} />;
}