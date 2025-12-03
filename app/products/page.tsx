import Link from "next/link";
import { Product } from "@/utils/types";
import { getProducts } from "@/utils/api";
import ProductTable from "@/components/products/ProductTable";
import StatisticsCards from "@/components/products/StatisticsCards";

export default async function ProductListPage() {
  // Server-side data fetching
  const productsData = await getProducts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link 
          href="/products/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Product
        </Link>
      </div>

      <ProductTable initialProducts={productsData} />
      <StatisticsCards products={productsData} />
    </div>
  );
}