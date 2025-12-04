import ViewCustomerClient from "@/components/customers/ViewCustomerClient";
import { getCustomer } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCustomerPage({ params }: PageProps) {
  const { id } = await params;
  const customerId = Number(id);
  
  // Fetch data on the server
  const customerData = await getCustomer(customerId);

  // Pass data as props to the client component
  return <ViewCustomerClient initialCustomer={customerData} />;
}