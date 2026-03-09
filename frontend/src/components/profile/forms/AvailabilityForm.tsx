"use client";

import { CheckIcon } from "@/components/icons";
import { AvailabilityStatus } from "@/lib/graphql/generated";

const availabilityOptions: {
  value: AvailabilityStatus;
  label: string;
  dotColor: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
}[] = [
  {
    value: "Available",
    label: "Available now",
    dotColor: "bg-green-500",
    selectedBg: "bg-green-100",
    selectedBorder: "border-green-500/40",
    selectedText: "text-green-500",
  },
  {
    value: "OpenToOffers",
    label: "Open to offers",
    dotColor: "bg-amber-500",
    selectedBg: "bg-amber-100",
    selectedBorder: "border-amber-500/40",
    selectedText: "text-amber-500",
  },
  {
    value: "NotAvailable",
    label: "Not available",
    dotColor: "bg-slate-400",
    selectedBg: "bg-slate-100",
    selectedBorder: "border-slate-400/40",
    selectedText: "text-slate-500",
  },
];

interface AvailabilityFormProps {
  availabilityStatus: AvailabilityStatus;
  onSubmit: (status: AvailabilityStatus) => Promise<void>;
  isLoading?: boolean;
}

export function AvailabilityForm({
  availabilityStatus,
  onSubmit,
  isLoading = false,
}: AvailabilityFormProps) {
  const handleSelect = async (status: AvailabilityStatus) => {
    if (status === availabilityStatus || isLoading) return;
    await onSubmit(status);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Availability
      </p>
      <div className="space-y-2">
        {availabilityOptions.map((option) => {
          const isSelected = availabilityStatus === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={isLoading}
              className={`w-full h-9 rounded-[14px] border-[1.5px] flex items-center gap-2.5 px-3 transition-colors disabled:opacity-50 ${
                isSelected
                  ? `${option.selectedBg} ${option.selectedBorder}`
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${option.dotColor}`} />
              <span
                className={`text-xs font-semibold ${
                  isSelected ? option.selectedText : "text-slate-500"
                }`}
              >
                {option.label}
              </span>
              {isSelected && (
                <CheckIcon
                  className={`w-3 h-3 ml-auto ${option.selectedText}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
