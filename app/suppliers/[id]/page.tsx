import ViewSupplierClient from "@/components/suppliers/ViewSupplierClient";
import { getSupplier } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewSupplierPage({ params }: PageProps) {
  const { id } = await params;
  const supplierId = Number(id);
  
  // Fetch data on the server
  const supplierData = await getSupplier(supplierId);

  // Pass data as props to the client component
  return <ViewSupplierClient initialSupplier={supplierData} />;
}