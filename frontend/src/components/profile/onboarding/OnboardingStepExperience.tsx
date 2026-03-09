"use client";

import { useForm } from "react-hook-form";
import { CheckIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import type { SeniorityLevel } from "@/lib/graphql/generated";

interface ExperienceOption {
  id: SeniorityLevel;
  label: string;
  years: string;
  color: string;
}

const experienceOptions: ExperienceOption[] = [
  { id: "Junior", label: "Junior", years: "0–2 yrs", color: "bg-emerald-500" },
  { id: "Mid", label: "Mid-level", years: "2–4 yrs", color: "bg-blue-500" },
  { id: "Senior", label: "Senior", years: "4–8 yrs", color: "bg-violet-500" },
  { id: "Lead", label: "Lead", years: "8–12 yrs", color: "bg-amber-500" },
  { id: "Principal", label: "Principal", years: "12+ yrs", color: "bg-red-500" },
];

interface ExperienceFormData {
  seniorityLevel: SeniorityLevel | null;
}

interface OnboardingStepExperienceProps {
  onBack: (data: { seniorityLevel: SeniorityLevel | null }) => void;
  onContinue: (data: { seniorityLevel: SeniorityLevel }) => void;
  initialData?: {
    seniorityLevel?: SeniorityLevel;
  };
  isSubmitting?: boolean;
}

export function OnboardingStepExperience({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepExperienceProps) {
  const { watch, setValue, handleSubmit } = useForm<ExperienceFormData>({
    mode: "onChange",
    defaultValues: {
      seniorityLevel: initialData?.seniorityLevel || null,
    },
  });

  const seniorityLevel = watch("seniorityLevel");
  const isValid = seniorityLevel !== null;

  const handleLevelSelect = (level: SeniorityLevel) => {
    if (seniorityLevel === level) {
      setValue("seniorityLevel", null);
    } else {
      setValue("seniorityLevel", level);
    }
  };

  const onSubmit = (data: ExperienceFormData) => {
    if (data.seniorityLevel) {
      onContinue({
        seniorityLevel: data.seniorityLevel,
      });
    }
  };

  const handleBack = () => onBack({ seniorityLevel })

  return (
    <OnboardingLayout currentStep="experience">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-[22px] font-extrabold text-slate-900">Your experience</h2>
              <p className="text-sm text-slate-500 mt-1">
                Be honest — companies filter by level.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Seniority level
              </label>
              <div className="flex flex-col gap-2">
                {experienceOptions.map((option) => {
                  const isSelected = seniorityLevel === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleLevelSelect(option.id)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors ${isSelected
                        ? "bg-violet-500/5 border-violet-500"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      <div className="flex-1 text-left">
                        <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                        <span className="text-xs text-slate-400 ml-1">{option.years}</span>
                      </div>
                      {isSelected && (
                        <CheckIcon className="w-4 h-4 text-violet-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <OnboardingFooter
            onBack={handleBack}
            isValid={isValid}
            submitForm
            isLoading={isSubmitting}
          />
        </form>
      </div>
    </OnboardingLayout>
  );
}
