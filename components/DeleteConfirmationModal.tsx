// "use client";

// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// interface DeleteConfirmationModalProps {
//   isOpen: boolean;
//   onConfirm: () => void;
//   onCancel: () => void;
//   itemName?: string;
// }

// export default function DeleteConfirmationModal({
//   isOpen,
//   onConfirm,
//   onCancel,
//   itemName = "this item"
// }: DeleteConfirmationModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-sm p-6">
//         {/* Icon and Title */}
//         <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full">
//           <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
//         </div>
        
//         {/* Message */}
//         <div className="text-center mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Delete Branch?
//           </h3>
//           <p className="text-gray-600 text-sm">
//             Delete <span className="font-medium">{itemName}</span>? This cannot be undone.
//           </p>
//         </div>
        
//         {/* Actions */}
//         <div className="flex space-x-3">
//           <button
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName?: string;
  itemType?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  itemName = "this item",
  itemType = "item"
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  // Format the item type for display (capitalize, handle special cases)
  const formatItemType = (type: string) => {
    if (!type) return "Item";
    
    // Handle special cases
    const specialCases: Record<string, string> = {
      "bank-branch": "Bank Branch",
      "cost-center": "Cost Center",
      "sales-person": "Sales Person",
      "credit-purchase": "Credit Purchase",
      "non-credit-purchase": "Non-Credit Purchase",
      "board-hardware": "Board Hardware"
    };
    
    if (specialCases[type]) {
      return specialCases[type];
    }
    
    // Capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formattedItemType = formatItemType(itemType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-sm p-6">
        {/* Icon and Title */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        
        {/* Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {formattedItemType}?
          </h3>
          <p className="text-gray-600 text-sm">
            Delete <span className="font-medium">{itemName}</span>? This cannot be undone.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}