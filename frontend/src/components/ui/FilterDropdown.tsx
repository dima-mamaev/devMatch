"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterDropdownProps<T extends string> {
  value: T | "";
  onChange: (value: T | "") => void;
  options: FilterOption<T>[];
  placeholder: string;
  allLabel?: string;
}

export function FilterDropdown<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  allLabel = "All",
}: FilterDropdownProps<T>) {
  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
  const isActive = value !== "";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all shadow-sm outline-none data-[state=open]:ring-2 data-[state=open]:ring-indigo-500 ${isActive
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
        >
          {selectedLabel}
          <ChevronDownIcon className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-45 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={8}
          align="start"
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as T | "")}
          >
            <DropdownMenu.RadioItem
              value=""
              className="relative flex items-center px-4 py-2 text-sm text-slate-600 outline-none cursor-pointer hover:bg-slate-50 data-[state=checked]:text-indigo-600 data-[state=checked]:font-medium data-[state=checked]:bg-indigo-50/50"
            >
              <DropdownMenu.ItemIndicator className="absolute left-1.5">
                <CheckIcon className="w-3 h-3" />
              </DropdownMenu.ItemIndicator>
              <span className="pl-4">{allLabel}</span>
            </DropdownMenu.RadioItem>
            <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
            {options.map((option) => (
              <DropdownMenu.RadioItem
                key={option.value}
                value={option.value}
                className="relative flex items-center px-4 py-2 text-sm text-slate-600 outline-none cursor-pointer hover:bg-slate-50 data-[state=checked]:text-indigo-600 data-[state=checked]:font-medium data-[state=checked]:bg-indigo-50/50"
              >
                <DropdownMenu.ItemIndicator className="absolute left-1.5">
                  <CheckIcon className="w-3 h-3" />
                </DropdownMenu.ItemIndicator>
                <span className="pl-4">{option.label}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
