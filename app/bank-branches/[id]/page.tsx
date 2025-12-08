import ViewBankBranchClient from "@/components/bank-branches/ViewBankBranchClient";
import { getBankBranch, getBanks } from "@/utils/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBankBranchPage({ params }: PageProps) {
  const { id } = await params;
  const branchId = Number(id);
  
  // Fetch data on the server
  const [branchData, banksData] = await Promise.all([
    getBankBranch(branchId),
    getBanks()
  ]);

  // Pass data as props to the client component
  return <ViewBankBranchClient 
    initialBranch={branchData} 
    initialBanks={banksData} 
  />;
}