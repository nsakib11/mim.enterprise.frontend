import Link from "next/link";
import { getPurchases, getSuppliers } from "@/utils/api";
import PurchaseTable from "@/components/purchases/PurchaseTable";

export default async function PurchaseListPage() {
  // Server-side data fetching
  const [purchasesData, suppliersData] = await Promise.all([
    getPurchases(),
    getSuppliers()
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchases</h1>
        <Link 
          href="/purchases/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Purchase
        </Link>
      </div>

      <PurchaseTable 
        initialPurchases={purchasesData} 
        initialSuppliers={suppliersData} 
      />
    </div>
  );
}