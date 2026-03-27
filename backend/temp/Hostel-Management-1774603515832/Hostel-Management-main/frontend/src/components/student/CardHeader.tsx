import React from "react";

interface CardHeaderProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, children, className }) => {
  return (
    <div className={`mb-4 ${className || ""}`}>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {children}
    </div>
  );
};
