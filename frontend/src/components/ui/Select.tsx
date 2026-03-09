"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  error,
  className = "",
  disabled = false,
}: SelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border bg-gray-50 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-300" : "border-gray-200"
              } ${selectedLabel ? "text-gray-900" : "text-gray-400"}`}
          >
            <span>{selectedLabel || placeholder}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 min-w-(--radix-dropdown-menu-trigger-width)"
            sideOffset={4}
            align="start"
          >
            <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
              {options.map((option) => (
                <DropdownMenu.RadioItem
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer hover:bg-slate-50 data-[state=checked]:text-indigo-600 data-[state=checked]:font-medium data-[state=checked]:bg-indigo-50/50"
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
