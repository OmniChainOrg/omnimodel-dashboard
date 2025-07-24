import * as React from "react"

interface BadgeProps {
  /** Content to display inside the badge */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: "default" | "outline" | "destructive" | "secondary";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800"
  } as const;
  return (
    <span className={`${base} ${variants[variant] ?? variants.default}`}>{children}</span>
  );
}
