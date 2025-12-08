// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

// interface ActionsDropdownProps {
//   branchId?: number;
//   branchName?: string;
//   onDeleteClick: (id?: number, name?: string) => void;
// }

// export default function ActionsDropdown({ 
//   branchId, 
//   branchName, 
//   onDeleteClick 
// }: ActionsDropdownProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleDelete = () => {
//     onDeleteClick(branchId, branchName);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//       >
//         <MoreVertical className="w-4 h-4" />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1">
//           <Link
//             href={`/bank-branches/${branchId}`}
//             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//             onClick={() => setIsOpen(false)}
//           >
//             <Eye className="w-4 h-4 mr-2" />
//             View
//           </Link>

//           <Link
//             href={`/bank-branches/${branchId}/edit`}
//             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//             onClick={() => setIsOpen(false)}
//           >
//             <Edit className="w-4 h-4 mr-2" />
//             Edit
//           </Link>

//           <button
//             onClick={handleDelete}
//             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
//           >
//             <Trash2 className="w-4 h-4 mr-2" />
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

interface ActionsDropdownProps {
  itemId?: number;
  itemName?: string;
  itemType: "bank" | "bank-branch" | "cost-center" | "customer" | "employee"| "inventory"| "product"| "purchase"|"sale"|"shop"|"supplier"|"unit"; // Add more types as needed
  onDeleteClick: (id?: number, name?: string) => void;
  customViewPath?: string; // Optional custom path for view
  customEditPath?: string; // Optional custom path for edit
}

export default function ActionsDropdown({ 
  itemId, 
  itemName, 
  itemType,
  onDeleteClick,
  customViewPath,
  customEditPath
}: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate base paths based on item type
  const getBasePath = () => {
    switch (itemType) {
      case "bank":
        return "/banks";
      case "bank-branch":
        return "/bank-branches";
      case "cost-center":
        return "/cost-center";
      case "customer":
        return "/customers";
      case "employee":
        return "/employees";
        case "inventory":
        return "/inventory";
         case "product":
      return "/products";
      case "purchase":
      return "/purchases";
       case "sale":
      return "/sales";
       case "shop":
      return "/shops";
      case "supplier":
      return "/suppliers";
        case "unit":
      return "/units";
      default:
        return `/${itemType}s`;
    }
  };

  const getViewPath = () => {
    if (customViewPath) return customViewPath;
    return `${getBasePath()}/${itemId}`;
  };

  const getEditPath = () => {
    if (customEditPath) return customEditPath;
    return `${getBasePath()}/${itemId}/edit`;
  };

  const handleDelete = () => {
    onDeleteClick(itemId, itemName);
    setIsOpen(false);
  };

  const getItemDisplayName = () => {
    switch (itemType) {
      case "bank-branch":
        return "Bank Branch";
      case "bank":
        return "Bank";
      case "cost-center":
        return "User";
      case "customer":
        return "Customer";
      case "employee":
        return "Employee";
        case "inventory":
        return "Inventory";
         case "product":
      return "Products";
      case "purchase":
      return "Purchases";
       case "sale":
      return "Sales";
       case "shop":
      return "Shops";
      case "supplier":
      return "Supplier";
        case "unit":
      return "Units";
      default:
        return "Item";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={`${getItemDisplayName()} actions`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1">
          <Link
            href={getViewPath()}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>

          <Link
            href={getEditPath()}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}