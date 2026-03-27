import React from 'react';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);
