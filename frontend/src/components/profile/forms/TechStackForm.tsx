"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CodeIcon, PencilIcon, CheckIcon, XIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

export interface TechStackFormData {
  techStack: string[];
}

interface TechStackFormProps {
  techStack: string[];
  onSubmit: (data: TechStackFormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  customTech: string;
  techStack: string[];
}

export function TechStackForm({ techStack: initialTechStack, onSubmit, isLoading = false }: TechStackFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, watch, setValue, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      customTech: "",
      techStack: initialTechStack,
    },
  });

  const techStack = watch("techStack");
  const customTech = watch("customTech");
  const isValid = techStack.length > 0;

  const handleEdit = () => {
    reset({
      customTech: "",
      techStack: initialTechStack,
    });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

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

  const handleFormSubmit = async (data: FormData) => {
    if (data.techStack.length === 0) return;
    await onSubmit({ techStack: data.techStack });
    setIsEditing(false);
  };

  const availableSuggested = suggestedTechnologies.filter((t) => !techStack.includes(t));

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Tech Stack</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost-muted"
                size="xs"
                onClick={handleCancel}
              >
                <XIcon className="w-3.5 h-3.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                variant="link"
                size="xs"
                disabled={isLoading || !isValid}
              >
                <CheckIcon className="w-3.5 h-3.5" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-4 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-300 transition-colors"
                >
                  {tech}
                  <XIcon className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
          )}

          {!isValid && (
            <p className="mb-3 text-xs text-red-500">At least one technology is required</p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {availableSuggested.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleToggleTech(tech)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
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
              className="size-10.5 rounded-xl"
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Tech Stack</h2>
        </div>
        <Button
          type="button"
          variant="link"
          size="xs"
          onClick={handleEdit}
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {initialTechStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
