"use client";

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${active
          ? "bg-primary text-white shadow-md scale-105"
          : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-sm"
        }
      `}
    >
      {label}
    </button>
  );
}
