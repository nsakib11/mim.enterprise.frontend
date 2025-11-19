"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    products: false,
    shops: false,
    costCenter: false,
    employee: false,
    inventory: false,
    suppliers: false,
    units: false,
    customers: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`bg-[#FFFDD0] text-gray-900 flex flex-col transition-all duration-300 ${
              collapsed ? "w-0 overflow-hidden" : "w-50"
            }`}
          >
            {/* Header with toggle button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h1
                className={`font-bold text-lg ${
                  collapsed ? "hidden" : "block"
                }`}
              >
                Menu
              </h1>
              <button
                onClick={() => setCollapsed(true)}
                className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ☰
              </button>
            </div>

            <nav className="flex flex-col mt-4 space-y-2 px-2 text-gray-900">
              {/* Home */}
              <div className="mt-2">
                <Link
                  href="/"
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded"
                >
                  🏠 Home
                </Link>
              </div>

              {/* Banks */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("banks")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Banks
                </button>
                {expandedSections.banks && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/banks"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/banks/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Bank Branches */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("bankBranches")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Bank Branches
                </button>
                {expandedSections.bankBranches && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/bank-branches"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/bank-branches/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Cost Center */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("costCenter")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Cost Center
                </button>
                {expandedSections.costCenter && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/cost-center"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/cost-center/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Customers */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("customers")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Customers
                </button>
                {expandedSections.customers && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/customers"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/customers/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Employee */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("employee")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Employee
                </button>
                {expandedSections.employee && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/employees"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/employees/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>

              {/* Inventory */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("inventory")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Inventory
                </button>
                {expandedSections.inventory && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/inventory"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/inventory/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Products */}
              <div>
                <button
                  onClick={() => toggleSection("products")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Products
                </button>
                {expandedSections.products && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/products"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/products/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Purchases */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("purchases")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Purchases
                </button>
                {expandedSections.purchases && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/purchases"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/purchases/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Sales */}
<div className="mt-2">
  <button
    onClick={() => toggleSection("sales")}
    className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
  >
    Sales
  </button>
  {expandedSections.sales && (
    <div className="flex flex-col ml-4 mt-1 space-y-1">
      <Link
        href="/sales"
        className="hover:bg-gray-200 rounded px-2 py-1"
      >
        List
      </Link>
      <Link
        href="/sales/create"
        className="hover:bg-gray-200 rounded px-2 py-1"
      >
        Create
      </Link>
    </div>
  )}
</div>
              {/* Shops */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("shops")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Shops
                </button>
                {expandedSections.shops && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/shops"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/shops/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>

              {/* Suppliers */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("suppliers")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Suppliers
                </button>
                {expandedSections.suppliers && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/suppliers"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/suppliers/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
              {/* Units */}
              <div className="mt-2">
                <button
                  onClick={() => toggleSection("units")}
                  className="font-semibold px-2 py-1 block hover:bg-gray-200 rounded w-full text-left"
                >
                  Units
                </button>
                {expandedSections.units && (
                  <div className="flex flex-col ml-4 mt-1 space-y-1">
                    <Link
                      href="/units"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      List
                    </Link>
                    <Link
                      href="/units/create"
                      className="hover:bg-gray-200 rounded px-2 py-1"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </aside>

          {/* Main content with expand button when sidebar is collapsed */}
          <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-100 transition-all duration-300 relative">
            {/* Expand button - only shown when sidebar is collapsed */}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="absolute left-6 top-6 p-2 bg-gray-300 rounded hover:bg-gray-400 z-10"
              >
                ☰
              </button>
            )}

            {/* Content container with margin when collapsed */}
            <div className={collapsed ? "ml-6" : ""}>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
