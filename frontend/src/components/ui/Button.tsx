"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "ghost-muted" | "link" | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

const variants = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
  secondary:
    "bg-white border border-gray-300 hover:border-gray-400 text-gray-700",
  outline:
    "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600",
  ghost: "text-gray-600 hover:text-gray-900",
  "ghost-muted": "text-slate-500 hover:text-slate-700",
  link: "text-indigo-600 hover:text-indigo-700",
  gradient: "text-white shadow-lg hover:opacity-90 bg-gradient-to-r from-indigo-600 to-violet-600",
};

const sizes = {
  xs: "px-3 py-1.5 text-xs rounded-lg",
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
  icon: "w-9 h-9 rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
  disabled = false,
  type = "submit",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={(e) => onClick?.(e)} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
