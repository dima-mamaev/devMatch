"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DocumentIcon, PencilIcon, CheckIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export interface AboutFormData {
  bio: string;
}

interface AboutFormProps {
  bio: string;
  onSubmit: (data: AboutFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AboutForm({ bio, onSubmit, isLoading = false }: AboutFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AboutFormData>({
    defaultValues: {
      bio,
    },
  });

  const handleEdit = () => {
    reset({ bio });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleFormSubmit = async (data: AboutFormData) => {
    await onSubmit(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">About</h2>
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
                disabled={isLoading}
              >
                <CheckIcon className="w-3.5 h-3.5" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Bio
            </label>
            <textarea
              {...register("bio", {
                required: "Bio is required",
                validate: (value) => value.trim() !== "" || "Bio is required"
              })}
              rows={4}
              className={`w-full py-3 px-4 rounded-xl border bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                errors.bio ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DocumentIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">About</h2>
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
      <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
    </div>
  );
}
