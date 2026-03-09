interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success";
  className?: string;
}

const variants = {
  default: "bg-gray-100 text-gray-600",
  primary: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  success: "bg-green-100 text-green-600",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
