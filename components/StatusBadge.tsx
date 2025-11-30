"use client";

interface StatusBadgeProps {
  active: boolean;
}

export default function StatusBadge({ active }: StatusBadgeProps) {
  const statusColors = {
    true: "bg-green-100 text-green-800",
    false: "bg-red-100 text-red-800"
  };
  
  const colorClass = statusColors[active.toString() as keyof typeof statusColors];
  const statusText = active ? "Active" : "Inactive";
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {statusText}
    </span>
  );
}