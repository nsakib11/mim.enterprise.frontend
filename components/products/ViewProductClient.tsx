"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/utils/types";
import { getProduct } from "@/utils/api";
import Link from "next/link";

interface ViewProductClientProps {
  initialProduct: Product;
}

export default function ViewProductClient({ initialProduct }: ViewProductClientProps) {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);

  useEffect(() => {
    // Only fetch if initial data wasn't provided or needs refresh
    const shouldRefetch = !initialProduct || initialProduct.id !== productId;
    
    if (shouldRefetch) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const data = await getProduct(productId);
          setProduct(data);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, initialProduct]);

  const handleEdit = () => {
    router.push(`/products/${productId}/edit`);
  };

  if (loading || !product) {
    return <p className="p-6 text-center text-gray-400">Loading...</p>;
  }

  const infoItems = [
    { label: "Code", value: product.code },
    { label: "Name", value: product.name },
    { label: "Name (Bn)", value: product.nameBn },
    { label: "Category", value: product.category },
    { label: "Supplier", value: product.supplier?.name || "-" },
    { label: "Unit", value: product.unit?.name || "-" },
    { label: "Active", value: product.active ? "Yes" : "No" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Product Details</h1>
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <Link 
            href="/products" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Back to List
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map(item => (
          <div
            key={item.label}
            className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-gray-500 uppercase text-xs font-medium">{item.label}</span>
            <p className="text-gray-800 font-semibold mt-1">{item.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}