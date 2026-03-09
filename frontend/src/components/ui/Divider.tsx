interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      {text && <span className="text-xs font-medium text-gray-400">{text}</span>}
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
