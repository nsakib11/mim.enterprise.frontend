import ViewSaleClient from "@/components/sales/ViewSaleClient";
import { getSale, getCustomers, getProducts, getEmployees, getInventories } from "@/utils/api";
import { Sales, Customer, Product, Employee, Inventory } from "@/utils/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewSalePage({ params }: PageProps) {
  const { id } = await params;
  const saleId = Number(id);
  
  // Fetch data on the server
  const [saleData, customersData, productsData, employeesData, inventoriesData] = await Promise.all([
    getSale(saleId),
    getCustomers(),
    getProducts(),
    getEmployees(),
    getInventories()
  ]);

  // Pass data as props to the client component
  return <ViewSaleClient 
    initialSale={saleData} 
    initialCustomers={customersData}
    initialProducts={productsData}
    initialEmployees={employeesData}
    initialInventories={inventoriesData}
  />;
}