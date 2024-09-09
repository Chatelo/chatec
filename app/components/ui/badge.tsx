import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "success",
}) => {
  const classNames = `
    inline-block px-2 py-1 rounded-md text-sm font-medium
    ${
      variant === "success"
        ? "bg-green-200 text-green-800"
        : variant === "warning"
        ? "bg-yellow-200 text-yellow-800"
        : "bg-red-200 text-red-800"
    }
  `;

  return <span className={classNames}>{children}</span>;
};
