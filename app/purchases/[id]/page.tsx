import ViewPurchaseClient from "@/components/purchases/ViewPurchaseClient";
import { getPurchase, getSuppliers, getProducts } from "@/utils/api";
import { PurchaseResponse, Supplier, Product } from "@/utils/types";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPurchasePage({ params }: PageProps) {
  const { id } = await params;
  const purchaseId = Number(id);
  
  // Fetch data on the server
  const [purchaseData, suppliersData, productsData] = await Promise.all([
    getPurchase(purchaseId),
    getSuppliers(),
    getProducts()
  ]);

  // Pass data as props to the client component
  return <ViewPurchaseClient 
    initialPurchase={purchaseData} 
    initialSuppliers={suppliersData}
    initialProducts={productsData}
  />;
}