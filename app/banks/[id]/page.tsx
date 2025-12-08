import ViewBankClient from "@/components/banks/ViewBankClient";
import { getBank } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBankPage({ params }: PageProps) {
  const { id } = await params;
  const bankId = Number(id);
  
  // Fetch data on the server
  const bankData = await getBank(bankId);

  // Pass data as props to the client component
  return <ViewBankClient initialBank={bankData} />;
}