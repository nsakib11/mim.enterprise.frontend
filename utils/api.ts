
import axios from "axios";
import { Product, Shop, Supplier, Unit , Customer, CostCenter, Employee, Inventory, Bank, BankBranch, Purchase, Sales } from "../utils/types";


export const getProductsBySupplier = async (supplierId: number): Promise<Product[]> => {
  const response = await fetch(`http://localhost:8080/api/products/by-supplier/${supplierId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by supplier');
  }
  return response.json();
};
const PRODUCT_API_URL = "http://localhost:8080/api/products";
const SHOP_API_URL = "http://localhost:8080/api/shops";
const SUPPLIER_API_URL = "http://localhost:8080/api/suppliers";
const UNIT_API_URL = "http://localhost:8080/api/units";
const COST_CENTER_API_URL = "http://localhost:8080/api/cost-centers";
const EMPLOYEES_API_URL = "http://localhost:8080/api/employees";
const INVENTORY_API_URL = "http://localhost:8080/api/inventories";
const CUSTOMER_API_URL = "http://localhost:8080/api/customers";
const BANK_API_URL = "http://localhost:8080/api/banks";
const BANK_BRANCH_API_URL = "http://localhost:8080/api/bank-branches";
const PURCHASE_API_URL = "http://localhost:8080/api/purchases";
const SALES_API_URL = "http://localhost:8080/api/sales";

// ------------------ Sales ------------------
export const getSales = (): Promise<Sales[]> =>
  axios.get<Sales[]>(SALES_API_URL).then(res => res.data);

export const getSale = (id: number): Promise<Sales> =>
  axios.get<Sales>(`${SALES_API_URL}/${id}`).then(res => res.data);

export const createSale = (sale: Sales): Promise<Sales> =>
  axios.post<Sales>(SALES_API_URL, sale).then(res => res.data);

export const updateSale = (id: number, sale: Sales): Promise<Sales> =>
  axios.put<Sales>(`${SALES_API_URL}/${id}`, sale).then(res => res.data);

export const deleteSale = (id: number): Promise<void> =>
  axios.delete(`${SALES_API_URL}/${id}`);

// ------------------ Purchases ------------------
export const getPurchases = (): Promise<Purchase[]> =>
  axios.get<Purchase[]>(PURCHASE_API_URL).then(res => res.data);

export const getPurchase = (id: number): Promise<Purchase> =>
  axios.get<Purchase>(`${PURCHASE_API_URL}/${id}`).then(res => res.data);

export const createPurchase = (purchase: Purchase): Promise<Purchase> =>
  axios.post<Purchase>(PURCHASE_API_URL, purchase).then(res => res.data);

export const updatePurchase = (id: number, purchase: Purchase): Promise<Purchase> =>
  axios.put<Purchase>(`${PURCHASE_API_URL}/${id}`, purchase).then(res => res.data);

export const deletePurchase = (id: number): Promise<void> =>
  axios.delete(`${PURCHASE_API_URL}/${id}`);

// ------------------ Bank Branches ------------------
export const getBankBranches = (): Promise<BankBranch[]> =>
  axios.get<BankBranch[]>(BANK_BRANCH_API_URL).then(res => res.data);

export const getBankBranch = (id: number): Promise<BankBranch> =>
  axios.get<BankBranch>(`${BANK_BRANCH_API_URL}/${id}`).then(res => res.data);

export const createBankBranch = (branch: BankBranch): Promise<BankBranch> =>
  axios.post<BankBranch>(BANK_BRANCH_API_URL, branch).then(res => res.data);

export const updateBankBranch = (id: number, branch: BankBranch): Promise<BankBranch> =>
  axios.put<BankBranch>(`${BANK_BRANCH_API_URL}/${id}`, branch).then(res => res.data);

export const deleteBankBranch = (id: number): Promise<void> =>
  axios.delete(`${BANK_BRANCH_API_URL}/${id}`);

// ------------------ Banks ------------------
export const getBanks = (): Promise<Bank[]> =>
  axios.get<Bank[]>(BANK_API_URL).then(res => res.data);

export const getBank = (id: number): Promise<Bank> =>
  axios.get<Bank>(`${BANK_API_URL}/${id}`).then(res => res.data);

export const createBank = (bank: Bank): Promise<Bank> =>
  axios.post<Bank>(BANK_API_URL, bank).then(res => res.data);

export const updateBank = (id: number, bank: Bank): Promise<Bank> =>
  axios.put<Bank>(`${BANK_API_URL}/${id}`, bank).then(res => res.data);

export const deleteBank = (id: number): Promise<void> =>
  axios.delete(`${BANK_API_URL}/${id}`);

// ------------------ Customers ------------------
export const getCustomers = (): Promise<Customer[]> =>
  axios.get<Customer[]>(CUSTOMER_API_URL).then(res => res.data);

export const getCustomer = (id: number): Promise<Customer> =>
  axios.get<Customer>(`${CUSTOMER_API_URL}/${id}`).then(res => res.data);

export const createCustomer = (customer: Customer): Promise<Customer> =>
  axios.post<Customer>(CUSTOMER_API_URL, customer).then(res => res.data);

export const updateCustomer = (id: number, customer: Customer): Promise<Customer> =>
  axios.put<Customer>(`${CUSTOMER_API_URL}/${id}`, customer).then(res => res.data);

export const deleteCustomer = (id: number): Promise<void> =>
  axios.delete(`${CUSTOMER_API_URL}/${id}`);

// ------------------ Products ------------------
export const getProducts = () =>
  axios.get<Product[]>(PRODUCT_API_URL).then(res => res.data);

export const getProduct = (id: number) =>
  axios.get<Product>(`${PRODUCT_API_URL}/${id}`).then(res => res.data);

export const createProduct = (product: Product) =>
  axios.post<Product>(PRODUCT_API_URL, product).then(res => res.data);

export const updateProduct = (id: number, product: Product) =>
  axios.put<Product>(`${PRODUCT_API_URL}/${id}`, product).then(res => res.data);

export const deleteProduct = (id: number) =>
  axios.delete(`${PRODUCT_API_URL}/${id}`);

// ------------------ Shops ------------------
export const getShops = () =>
  axios.get<Shop[]>(SHOP_API_URL).then(res => res.data);

export const getShop = (id: number) =>
  axios.get<Shop>(`${SHOP_API_URL}/${id}`).then(res => res.data);

export const createShop = (shop: Shop) =>
  axios.post<Shop>(SHOP_API_URL, shop).then(res => res.data);

export const updateShop = (id: number, shop: Shop) =>
  axios.put<Shop>(`${SHOP_API_URL}/${id}`, shop).then(res => res.data);

export const deleteShop = (id: number) =>
  axios.delete(`${SHOP_API_URL}/${id}`);

// ------------------ Suppliers ------------------
export const getSuppliers = () =>
  axios.get<Supplier[]>(SUPPLIER_API_URL).then(res => res.data);

export const getSupplier = (id: number) =>
  axios.get<Supplier>(`${SUPPLIER_API_URL}/${id}`).then(res => res.data);

export const createSupplier = (supplier: Supplier) =>
  axios.post<Supplier>(SUPPLIER_API_URL, supplier).then(res => res.data);

export const updateSupplier = (id: number, supplier: Supplier) =>
  axios.put<Supplier>(`${SUPPLIER_API_URL}/${id}`, supplier).then(res => res.data);

export const deleteSupplier = (id: number) =>
  axios.delete(`${SUPPLIER_API_URL}/${id}`);

// ------------------ Units ------------------
export const getUnits = () =>
  axios.get<Unit[]>(UNIT_API_URL).then(res => res.data);

export const getUnit = (id: number) =>
  axios.get<Unit>(`${UNIT_API_URL}/${id}`).then(res => res.data);

export const createUnit = (unit: Unit) =>
  axios.post<Unit>(UNIT_API_URL, unit).then(res => res.data);

export const updateUnit = (id: number, unit: Unit) =>
  axios.put<Unit>(`${UNIT_API_URL}/${id}`, unit).then(res => res.data);

export const deleteUnit = (id: number) =>
  axios.delete(`${UNIT_API_URL}/${id}`);

// ------------------ const-center ------------------
export const getCostCenters = () =>
  axios.get<CostCenter[]>(COST_CENTER_API_URL).then(res => res.data);

export const getCostCenter = (id: number) =>
  axios.get<CostCenter>(`${COST_CENTER_API_URL}/${id}`).then(res => res.data);

export const createCostCenter = (costCenter: CostCenter) =>
  axios.post<CostCenter>(COST_CENTER_API_URL, costCenter).then(res => res.data);

export const updateCostCenter = (id: number, costCenter: CostCenter) =>
  axios.put<CostCenter>(`${COST_CENTER_API_URL}/${id}`, costCenter).then(res => res.data);

export const deleteCostCenter = (id: number) =>
  axios.delete(`${COST_CENTER_API_URL}/${id}`);

// ------------------ Employyes ------------------
export const getEmployees = () =>
  axios.get<Employee[]>(EMPLOYEES_API_URL).then(res => res.data);

export const getEmployee = (id: number) =>
  axios.get<Employee>(`${EMPLOYEES_API_URL}/${id}`).then(res => res.data);

export const createEmployee = (employee: Employee) =>
  axios.post<Employee>(EMPLOYEES_API_URL, employee).then(res => res.data);

export const updateEmployee = (id: number, employee: Employee) =>
  axios.put<Employee>(`${EMPLOYEES_API_URL}/${id}`, employee).then(res => res.data);

export const deleteEmployee = (id: number) =>
  axios.delete(`${EMPLOYEES_API_URL}/${id}`);
// ------------------ Inventory ------------------
export const getInventories = () =>
  axios.get<Inventory[]>(INVENTORY_API_URL).then(res => res.data);

export const getInventory = (id: number) =>
  axios.get<Inventory>(`${INVENTORY_API_URL}/${id}`).then(res => res.data);

export const createInventory = (inventory: Inventory) =>
  axios.post<Inventory>(INVENTORY_API_URL, inventory).then(res => res.data);

export const updateInventory = (id: number, inventory: Inventory) =>
  axios.put<Inventory>(`${INVENTORY_API_URL}/${id}`, inventory).then(res => res.data);

export const deleteInventory = (id: number) =>
  axios.delete(`${INVENTORY_API_URL}/${id}`);


const INVOICE_API_URL = "http://localhost:8080/api/purchases";

// ------------------ Invoice Generation ------------------
export const generatePurchaseInvoice = async (purchaseId: number, format: 'pdf' | 'word' | 'excel' = 'pdf'): Promise<Blob> => {
  const response = await axios.get(`${INVOICE_API_URL}/${purchaseId}/invoice?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const downloadPurchaseInvoice = async (purchaseId: number, format: 'pdf' | 'word' | 'excel' = 'pdf'): Promise<void> => {
  try {
    const blob = await generatePurchaseInvoice(purchaseId, format);
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const fileExtension = getFileExtension(format);
    const filename = `purchase_invoice_${purchaseId}.${fileExtension}`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

const getFileExtension = (format: 'pdf' | 'word' | 'excel'): string => {
  switch (format) {
    case 'pdf':
      return 'pdf';
    case 'word':
      return 'doc';
    case 'excel':
      return 'xlsx';
    default:
      return 'pdf';
  }
};

const getContentType = (format: 'pdf' | 'word' | 'excel'): string => {
  switch (format) {
    case 'pdf':
      return 'application/pdf';
    case 'word':
      return 'application/msword';
    case 'excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default:
      return 'application/pdf';
  }
};
