import React from "react";

interface BadgeProps {
  text?: string; // ✅ make optional
  color?: "green" | "red" | "yellow" | "blue";
  className?: string;
  children?: React.ReactNode; // ✅ allow children
}

const colors: Record<string, string> = {
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  blue: "bg-blue-100 text-blue-800",
};

export const Badge: React.FC<BadgeProps> = ({
  text,
  color = "blue",
  className,
  children,
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[color]} ${className || ""}`}
    >
      {children || text}
    </span>
  );
};
