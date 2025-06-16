import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  let base = "px-4 py-2 rounded text-white ";
  let variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700",
    outline: "border border-current text-current",
  };

  return (
    <button
      className={`${base}${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
