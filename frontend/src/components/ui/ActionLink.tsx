"use client";

import Link from "next/link";

interface ActionLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  internal?: boolean;
}

export function ActionLink({
  href,
  label,
  icon,
  internal = false,
}: ActionLinkProps) {
  const content = (
    <>
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:bg-slate-200 transition-colors">
        {icon}
      </div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </>
  );

  if (internal) {
    return (
      <Link href={href} className="flex flex-col items-center gap-1.5">
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5"
    >
      {content}
    </a>
  );
}
