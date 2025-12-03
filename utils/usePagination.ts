// hooks/usePagination.ts
import { useState, useMemo, useEffect } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
  searchableFields?: (keyof T)[];
}

export function usePagination<T>({
  data,
  itemsPerPage,
  initialPage = 1,
  searchableFields = [],
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Apply search filter when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      // Search in specified fields or all string fields if none specified
      if (searchableFields.length > 0) {
        return searchableFields.some((field) => {
          const value = item[field];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(lowercasedSearch)
          );
        });
      }

      // Search in all string fields
      return Object.values(item).some((value) => {
        return typeof value === "string" && value.toLowerCase().includes(lowercasedSearch);
      });
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, data, searchableFields]);

  // Calculate pagination values
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalItems = filteredData.length;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setPageSize = (size: number) => {
    setCurrentPage(1);
    // You can return this function to be used from component
    return size;
  };

  return {
    currentPage,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    paginatedData,
    totalPages,
    totalItems,
    searchTerm,
    setSearchTerm,
    filteredData,
    setPageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  };
}