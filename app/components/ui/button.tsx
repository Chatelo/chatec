import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...props
}) => {
  const classNames = `
    px-4 py-2 rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      variant === "primary"
        ? "bg-blue-500 hover:bg-blue-700 text-white"
        : variant === "secondary"
        ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
        : "bg-red-500 hover:bg-red-700 text-white"
    }
  `;

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};
