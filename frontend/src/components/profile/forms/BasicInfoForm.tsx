"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserIcon, PencilIcon, CheckIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SeniorityLevel } from "@/lib/graphql/generated";

const experienceOptions = [
  { value: "Junior", label: "Junior (0–2 yrs)" },
  { value: "Mid", label: "Mid-level (2–4 yrs)" },
  { value: "Senior", label: "Senior (4–8 yrs)" },
  { value: "Lead", label: "Lead (8–12 yrs)" },
  { value: "Principal", label: "Principal (12+ yrs)" },
];

export interface BasicInfoFormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  seniorityLevel: SeniorityLevel;
}

interface BasicInfoFormProps {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  seniorityLevel: SeniorityLevel;
  onSubmit: (data: BasicInfoFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BasicInfoForm({
  firstName,
  lastName,
  jobTitle,
  location,
  seniorityLevel,
  onSubmit,
  isLoading = false,
}: BasicInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues: {
      firstName,
      lastName,
      jobTitle,
      location,
      seniorityLevel,
    },
  });

  const fullName = `${firstName} ${lastName}`;
  const experienceLabel = experienceOptions.find((o) => o.value === seniorityLevel);

  const handleEdit = () => {
    reset({
      firstName,
      lastName,
      jobTitle,
      location,
      seniorityLevel,
    });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleFormSubmit = async (data: BasicInfoFormData) => {
    await onSubmit(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Basic Info</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              {...register("firstName", {
                required: "First name is required",
                validate: (value) => value.trim() !== "" || "First name is required"
              })}
              error={errors.firstName?.message}
            />
            <Input
              label="Last name"
              {...register("lastName", {
                required: "Last name is required",
                validate: (value) => value.trim() !== "" || "Last name is required"
              })}
              error={errors.lastName?.message}
            />
            <Input
              label="Job title"
              {...register("jobTitle", {
                required: "Job title is required",
                validate: (value) => value.trim() !== "" || "Job title is required"
              })}
              error={errors.jobTitle?.message}
            />
            <Input
              label="Location"
              {...register("location", {
                required: "Location is required",
                validate: (value) => value.trim() !== "" || "Location is required"
              })}
              error={errors.location?.message}
            />
            <Controller
              name="seniorityLevel"
              control={control}
              rules={{ required: "Experience level is required" }}
              render={({ field }) => (
                <Select
                  label="Experience"
                  options={experienceOptions}
                  placeholder="Select experience level"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.seniorityLevel?.message}
                  className="col-span-2"
                />
              )}
            />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Basic Info</h2>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Full name</p>
          <p className="text-sm font-medium text-slate-900">{fullName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Job title</p>
          <p className="text-sm font-medium text-slate-900">{jobTitle}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Location</p>
          <p className="text-sm font-medium text-slate-900">{location}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Experience</p>
          <p className="text-sm font-medium text-slate-900">
            {experienceLabel?.label}
          </p>
        </div>
      </div>
    </div>
  );
}
