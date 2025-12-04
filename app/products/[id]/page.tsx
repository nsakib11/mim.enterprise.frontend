import ViewProductClient from "@/components/products/ViewProductClient";
import { getProduct } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  
  // Fetch data on the server
  const productData = await getProduct(productId);

  // Pass data as props to the client component
  return <ViewProductClient initialProduct={productData} />;
}