"use client";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
  icon: React.ReactNode;
}

export function ActionButton({
  onClick,
  disabled,
  active,
  label,
  icon,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${
          active
            ? "bg-indigo-500/20 border-2 border-indigo-500/40 text-indigo-600"
            : "bg-slate-100 border-2 border-transparent text-slate-500 hover:bg-slate-200"
        }`}
      >
        {icon}
      </div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </button>
  );
}
