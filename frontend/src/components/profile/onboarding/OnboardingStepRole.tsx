"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPinIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import { Input } from "@/components/ui/Input";

const jobTitles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "iOS Developer",
  "Android Developer",
  "DevOps Engineer",
  "Data Engineer",
  "ML Engineer",
  "Mobile Developer",
  "Platform Engineer",
];

interface RoleFormData {
  customJobTitle: string;
  location: string;
}

interface OnboardingStepRoleProps {
  onBack: (data: { jobTitle: string; location: string }) => void;
  onContinue: (data: { jobTitle: string; location: string }) => void;
  initialData?: {
    jobTitle?: string;
    location?: string;
  };
  isSubmitting?: boolean;
}

export function OnboardingStepRole({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepRoleProps) {
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(
    initialData?.jobTitle && jobTitles.includes(initialData.jobTitle) ? initialData.jobTitle : null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormData>({
    mode: "onChange",
    defaultValues: {
      customJobTitle: initialData?.jobTitle && !jobTitles.includes(initialData.jobTitle) ? initialData.jobTitle : "",
      location: initialData?.location || "",
    },
  });

  const formValues = watch();
  const effectiveJobTitle = selectedJobTitle || formValues.customJobTitle;
  const isValid = effectiveJobTitle.trim().length > 0 && formValues.location.trim().length > 0;

  const handleJobTitleSelect = (title: string) => {
    if (selectedJobTitle === title) {
      setSelectedJobTitle(null);
    } else {
      setSelectedJobTitle(title);
      setValue("customJobTitle", "");
    }
  };

  const handleCustomJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedJobTitle(null);
    }
  };

  const onSubmit = (data: RoleFormData) => {
    onContinue({
      jobTitle: effectiveJobTitle.trim(),
      location: data.location.trim(),
    });
  };

  const handleBack = () => {
    onBack({
      jobTitle: effectiveJobTitle.trim(),
      location: formValues.location.trim(),
    });
  };

  return (
    <OnboardingLayout currentStep="role-location">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            <div className="mb-5">
              <h2 className="text-[22px] font-extrabold text-slate-900">Role & location</h2>
              <p className="text-sm text-slate-500 mt-1">
                Tell companies what you do and where you're based.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Job title
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {jobTitles.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => handleJobTitleSelect(title)}
                    className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                      selectedJobTitle === title
                        ? "bg-indigo-600 text-white border-[1.5px] border-indigo-600"
                        : "bg-slate-100 text-slate-600 border-[1.5px] border-transparent hover:bg-slate-200"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or type your own…"
                {...register("customJobTitle", {
                  onChange: handleCustomJobTitleChange,
                })}
              />
            </div>
            <Input
              label="Location"
              placeholder="San Francisco, CA · or Remote"
              icon={<MapPinIcon className="w-3.5 h-3.5" />}
              error={errors.location?.message}
              {...register("location", {
                required: "Location is required",
              })}
            />
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
