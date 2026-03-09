import Link from "next/link";
import { SparklesIcon } from "@/components/icons";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: "w-7 h-7", iconInner: "w-4 h-4", text: "text-base" },
  md: { icon: "w-9 h-9", iconInner: "w-5 h-5", text: "text-lg" },
  lg: { icon: "w-11 h-11", iconInner: "w-6 h-6", text: "text-xl" },
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.icon} bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg`}
      >
        <SparklesIcon className={`${s.iconInner} text-white`} />
      </div>
      <span className={`${s.text} font-extrabold text-gray-900`}>DevMatch</span>
    </Link>
  );
}
