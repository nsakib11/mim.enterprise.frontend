// types.ts
export enum SupplierProduct {
  BOARD = "BOARD",
  HARDWARE = "HARDWARE",
  BOARD_HARDWARE = "BOARD_HARDWARE"
}

export enum SupplierType {
   CREDIT_PURCHASE = " CREDIT_PURCHASE",
  NON_CREDIT_PURCHASE = "NON_CREDIT_PURCHASE"       
}
export enum CustomerType {
  INDIVIDUAL = "INDIVIDUAL",
  PARTY = "PARTY"
}
export enum PaymentType {
  CASH = "CASH",
  CREDIT = "CREDIT"
}

export enum PaymentStatus {
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  DUE = "DUE"
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  COMPLETED = "COMPLETED"
}

export enum ProductCategory {
  BOARD = "BOARD",
  HARDWARE = "HARDWARE",
  BOARD_HARDWARE = "BOARD_HARDWARE"
}
export enum PaymentMethod {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  BANK_TRANSFER = "BANK_TRANSFER"
}

export interface SalesItem {
  id?: number;
  sales?: Sales;
  product?: Product;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productCategory: ProductCategory;
  deliveredQuantity: number;
  pendingQuantity: number;
}

// export interface Sales {
//   id?: number;
//   invoiceNo: string;
//   invoiceDate: string;
//   customer?: Customer;
//   deliveryToken: string;
//   deliveryAddress: string;
//   deliveryAddressBn: string;
//   deliveryStatus: DeliveryStatus;
//   totalAmount: number;
//   paidAmount: number;
//   dueAmount: number;
//   paymentStatus: PaymentStatus;
//   paymentMethod: PaymentMethod;
//   salesPerson?: Employee;
//   inventory?: Inventory;
//   returnValidUntil: string;
//   isReturned: boolean;
//   salesItems: SalesItem[];
// }
export interface Sales {
  id?: number;
  invoiceNo: string;
  invoiceDate: string;
  customerId?: number;
   salesPerson?: Employee;
  inventory?: Inventory;
    customer?: Customer;
  customerName?: string;
  deliveryToken: string;
  deliveryAddress: string;
  deliveryAddressBn: string;
  deliveryStatus: DeliveryStatus;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  salesPersonId?: number;
  salesPersonName?: string;
  inventoryId?: number;
  inventoryName?: string,
  returnValidUntil: string;
  isReturned: boolean;
  salesItems: SalesItem[];
}

export interface PurchaseItem {
  id?: number;
  purchase?: Purchase;
  product?: Product;
  orderedQuantity: number;
  deliveredQuantity: number;
  pendingQuantity: number;
  purchasePrice: number;
  salesPriceMin: number;
  salesPriceMax: number;
  currentPurchasePrice: number;
  inventory?: Inventory;
  productCategory: ProductCategory;
}

export interface Purchase {
  id?: number;
  purchaseOrderNo: string;
  orderDate: string;
  expectedDeliveryDate: string;
  supplier?: Supplier;
  quotationNo: string;
  supplierInvoiceNo: string;
  paymentType: PaymentType;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  totalOrderedQuantity: number;
  totalDeliveredQuantity: number;
  totalPendingQuantity: number;
  priceLocked: boolean;
  purchaseItems: PurchaseItem[];
}

export interface PurchaseItemResponse {
  id?: number;
  purchase?: Purchase;
  product?: Product;
  productId?: number; // Added from API response
  productName?: string; // Added from API response
  orderedQuantity: number;
  deliveredQuantity: number;
  pendingQuantity: number;
  purchasePrice: number;
  salesPriceMin: number;
  salesPriceMax: number;
  currentPurchasePrice: number;
  inventory?: Inventory;
  inventoryId?:number,
  productCategory: ProductCategory;
}

export interface PurchaseResponse {
  id?: number;
  purchaseOrderNo: string;
  orderDate: string;
  expectedDeliveryDate: string;
  supplier?: Supplier;
  supplierId?: number; // Added from API response
  supplierName?: string; // Added from API response
  quotationNo: string;
  supplierInvoiceNo: string;
  paymentType: PaymentType;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  totalOrderedQuantity: number;
  totalDeliveredQuantity: number;
  totalPendingQuantity: number;
  priceLocked: boolean;
  purchaseItems: PurchaseItemResponse[];
}
export interface Customer {
  id?: number;
  code: string;
  name: string;
  nameBn: string;
  customerType: CustomerType;
  mobile: string;
  email: string;
  address: string;
  active: boolean;
}
export interface Supplier {
  id?: number;
  code: string;
  name: string;
  nameBn: string;
  supplierProduct: SupplierProduct;
  supplierType: SupplierType;
  responsiblePerson: string;
  mobile: string;
  telephone: string;
  email: string;
  website: string;
  address: string;
  isActive: boolean;
}

export interface Unit {
  id?: number;
  name: string;
  nameBn: string;
  active: boolean;
}

export interface Product {
  id?: number;
  code: string;
  name: string;
  nameBn?: string;
  category?: string;
  supplier?: Supplier;
  unit?: Unit;
  active?: boolean;
}
export interface Shop {
  id?: number;
  code: string;
  name: string;
  nameBn?: string;
  address?: string;
  monthlySalesTarget?: number;
  yearlySalesTarget?: number;
  shopRent?: number;
  entertainmentBudget?: number;
  pettyCashLimit?: number;
  active?: boolean;
}
export enum CostCenterType {
  SHOP = "SHOP",
  OFFICE = "OFFICE",
  INVENTORY = "INVENTORY",
  GENERAL = "GENERAL"
}

export interface CostCenter {
  id?: number;
  code: string;
  name: string;
  nameBn?: string;
  costCenterType: CostCenterType;
  active: boolean;
}

export enum EmployeeType {
  SALES_PERSON = "SALES_PERSON",
  DRIVER = "DRIVER",
  LABOR = "LABOR",
  OFFICER = "OFFICER",
  MANAGER = "MANAGER",
}

export enum EmploymentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  TERMINATED = "TERMINATED",
  ON_LEAVE = "ON_LEAVE"
}
export interface Bank {
  id?: number;
  code: string;
  name: string;
  nameBn: string;
  headOfficeAddress: string;
  website: string;
  active: boolean;
}
export interface BankBranch {
  id?: number;
  code: string;
  bank?: Bank;
  name: string;
  nameBn: string;
  address: string;
  contactPersonName: string;
  mobile: string;
  email: string;
  routingNo: string;
  active: boolean;
}

export interface Employee {
  id?: number;
  code: string;
  name: string;
  nameBn?: string;
  employeeType: EmployeeType;
  mobile?: string;
  email?: string;
  address?: string;
  nidNumber?: string;
  joinDate?: string;
  dateOfBirth?: string;
  basicSalary?: number;
  currentSalary?: number;
  shop?: { id: number; name: string };
  costCenter?: { id: number; name: string };
  employmentStatus: EmploymentStatus;
  active: boolean;
}
export interface Inventory {
   id?: number;
  code: string;
  name: string;
  nameBn?: string;
  address?: string;
  responsiblePerson?: string;
  mobile?: string;
  active: boolean;
}