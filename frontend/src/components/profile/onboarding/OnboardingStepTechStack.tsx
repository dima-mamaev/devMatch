"use client";

import { useForm } from "react-hook-form";
import { XIcon, PlusIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const suggestedTechnologies = [
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Vue",
  "Angular",
  "Python",
  "Go",
  "Java",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Terraform",
  "Figma",
  "Three.js",
  "Tailwind CSS",
];

interface TechStackFormData {
  customTech: string;
  techStack: string[];
}

interface OnboardingStepTechStackProps {
  onBack: (data: { techStack: string[] }) => void;
  onContinue: (data: { techStack: string[] }) => void;
  initialData?: {
    techStack?: string[];
  };
  isSubmitting?: boolean;
}

export function OnboardingStepTechStack({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepTechStackProps) {
  const { register, watch, setValue, handleSubmit } = useForm<TechStackFormData>({
    mode: "onChange",
    defaultValues: {
      customTech: "",
      techStack: initialData?.techStack || [],
    },
  });

  const techStack = watch("techStack");
  const customTech = watch("customTech");
  const isValid = techStack.length > 0;

  const handleToggleTech = (tech: string) => {
    if (techStack.includes(tech)) {
      setValue("techStack", techStack.filter((t) => t !== tech));
    } else {
      setValue("techStack", [...techStack, tech]);
    }
  };

  const handleRemoveTech = (tech: string) => {
    setValue("techStack", techStack.filter((t) => t !== tech));
  };

  const handleAddCustomTech = () => {
    const trimmed = customTech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setValue("techStack", [...techStack, trimmed]);
      setValue("customTech", "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTech();
    }
  };

  const onSubmit = (data: TechStackFormData) => {
    if (data.techStack.length > 0) {
      onContinue({ techStack: data.techStack });
    }
  };

  const handleBack = () => {
    onBack({ techStack });
  };

  const availableSuggested = suggestedTechnologies.filter((t) => !techStack.includes(t));

  return (
    <OnboardingLayout currentStep="tech-stack">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            <div className="mb-5">
              <h2 className="text-[22px] font-extrabold text-slate-900">Tech stack</h2>
              <p className="text-sm text-slate-500 mt-1">
                Pick everything you're comfortable shipping with.
              </p>
            </div>
            {techStack.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-[14px] p-3 mb-5 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-200 rounded-[10px] text-xs font-semibold text-indigo-700 hover:bg-indigo-300 transition-colors"
                  >
                    {tech}
                    <XIcon className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-5">
              {availableSuggested.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleToggleTech(tech)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-[10px] text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  {tech}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Add custom technology…"
                  onKeyDown={handleKeyDown}
                  {...register("customTech")}
                />
              </div>
              <Button
                variant="primary"
                size="icon"
                type="button"
                onClick={handleAddCustomTech}
                disabled={!customTech.trim()}
                className="size-10.5 rounded-[14px]"
              >
                <PlusIcon className="w-4.5 h-4.5" />
              </Button>
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
