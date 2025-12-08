"use client";

import { downloadSalesInvoice, getSales } from "@/utils/api";
import { Sales } from "@/utils/types";
import { useEffect, useState } from "react";

type FormatType = "pdf" | "word" | "excel";

export default function InvoiceReport() {
  const [Sales, setSales] = useState<Sales[]>([]);
  const [selectedSaleId, setSelectedSaleId] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("pdf");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch Sales on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");
      const SaleData = await getSales();
      setSales(SaleData);
    } catch (err: any) {
      setError("Failed to fetch Sales");
      console.error("Error fetching Sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    if (!selectedSaleId) {
      setError("Please select a Sale");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Use the new API function
      await downloadSalesInvoice(
        parseInt(selectedSaleId),
        selectedFormat
      );

      console.log("Invoice downloaded successfully");
    } catch (err: any) {
      console.error("Error generating invoice:", err);

      if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
        setError(
          "Cannot connect to the server. Please make sure the Spring Boot backend is running on http://localhost:8080"
        );
      } else if (err.response) {
        setError(
          `Server error: ${err.response.status} - ${err.response.statusText}`
        );
      } else if (err.request) {
        setError(
          "No response from server. Please check if the backend is running."
        );
      } else {
        setError(`Failed to generate invoice: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Sales Invoice Report Generator
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm font-medium">Error:</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Sale Selection Dropdown */}
            <div>
              <label
                htmlFor="Sale"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Sales
              </label>
              <select
                id="Sale"
                value={selectedSaleId}
                onChange={(e) => setSelectedSaleId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">Select a Sale...</option>
                {Sales.map((Sale) => (
                  <option key={Sale.id} value={Sale.id}>
                    {Sale.invoiceNo}
                  </option>
                ))}
              </select>
              {Sales.length === 0 && !loading && (
                <p className="mt-1 text-sm text-gray-500">No Sales found</p>
              )}
            </div>

            {/* Format Selection Dropdown */}
            <div>
              <label
                htmlFor="format"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Format
              </label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as FormatType)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="pdf">PDF</option>
                {/* <option value="word">Word Document</option>
                <option value="excel">Excel Spreadsheet</option> */}
              </select>
            </div>

            {/* Generate Button */}
            <div>
              <button
                onClick={generateInvoice}
                disabled={loading || !selectedSaleId}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Invoice"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
