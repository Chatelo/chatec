import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-skin-fill text-skin-base shadow rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
};

interface CardContentProps {
  children: ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <div className="mt-4">{children}</div>;
};
