"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BriefcaseIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Experience } from "@/lib/graphql/generated";

export interface ExperienceFormData {
  position: string;
  companyName: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface AddExperienceData {
  position: string;
  companyName: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
}

export interface UpdateExperienceData extends AddExperienceData {
  id: string;
}

interface ExperienceFormProps {
  experiences: Array<Pick<Experience, 'id' | 'position' | 'companyName' | 'startYear' | 'endYear' | 'description'>>;
  onAdd: (data: AddExperienceData) => Promise<void>;
  onUpdate: (data: UpdateExperienceData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

function formatDateRange(startYear: number, endYear?: number | null): string {
  if (!endYear) {
    return `${startYear} – Present`;
  }
  return `${startYear} – ${endYear}`;
}

function ExperienceCard({
  experience,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  isDeleting,
}: {
  experience: Pick<Experience, 'id' | 'position' | 'companyName' | 'startYear' | 'endYear' | 'description'>;
  isFirst: boolean;
  isLast: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  const isCurrent = !experience.endYear;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center w-2.5">
        <div className="pt-1">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isCurrent ? "bg-indigo-600" : "bg-slate-300"
              }`}
          />
        </div>
        {!isLast && <div className="flex-1 w-px bg-slate-200 mt-1.5" />}
      </div>
      <div className="flex-1 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{experience.position}</p>
            <p className="text-sm font-medium text-slate-500">{experience.companyName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {formatDateRange(experience.startYear, experience.endYear)}
            </span>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <PencilIcon className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        {experience.description && (
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            {experience.description}
          </p>
        )}
      </div>
    </div>
  );
}

function ExperienceFormFields({
  experience,
  onSave,
  onCancel,
  isLoading,
}: {
  experience?: Pick<Experience, 'id' | 'position' | 'companyName' | 'startYear' | 'endYear' | 'description'>;
  onSave: (data: ExperienceFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, formState: { errors } } = useForm<ExperienceFormData>({
    defaultValues: {
      position: experience?.position || "",
      companyName: experience?.companyName || "",
      startYear: experience?.startYear?.toString() || "",
      endYear: experience?.endYear?.toString() || "",
      description: experience?.description || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="border border-slate-200 rounded-[14px] p-4 space-y-3">
      <Input
        label="Position"
        placeholder="e.g. Senior Software Engineer"
        {...register("position", {
          required: "Position is required",
          validate: (value) => value.trim() !== "" || "Position is required",
        })}
        error={errors.position?.message}
      />
      <Input
        label="Company"
        placeholder="e.g. Acme Inc."
        {...register("companyName", {
          required: "Company name is required",
          validate: (value) => value.trim() !== "" || "Company name is required",
        })}
        error={errors.companyName?.message}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start year"
          type="number"
          placeholder={currentYear.toString()}
          {...register("startYear", {
            required: "Start year is required",
            min: { value: 1950, message: "Invalid year" },
            max: { value: currentYear, message: "Invalid year" },
          })}
          error={errors.startYear?.message}
        />
        <Input
          label="End year"
          type="number"
          placeholder="Leave empty for present"
          {...register("endYear", {
            min: { value: 1950, message: "Invalid year" },
            max: { value: currentYear + 1, message: "Invalid year" },
          })}
          error={errors.endYear?.message}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={2}
          placeholder="Brief description of your role and achievements..."
          className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost-muted"
          size="xs"
          onClick={onCancel}
        >
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
    </form>
  );
}

export function ExperienceForm({ experiences, onAdd, onUpdate, onDelete, isLoading = false }: ExperienceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const sortedExperiences = [...experiences].sort((a, b) => b.startYear - a.startYear);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditingExperienceId(null);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingExperienceId(null);
    setIsAddingNew(true);
  };

  const handleEditExperience = (id: string) => {
    setIsAddingNew(false);
    setEditingExperienceId(id);
  };

  const parseFormData = (data: ExperienceFormData): AddExperienceData => {
    return {
      position: data.position.trim(),
      companyName: data.companyName.trim(),
      startYear: parseInt(data.startYear, 10),
      endYear: data.endYear.trim() ? parseInt(data.endYear, 10) : null,
      description: data.description.trim() || null,
    };
  };

  const handleSaveNew = async (data: ExperienceFormData) => {
    await onAdd(parseFormData(data));
    setIsAddingNew(false);
  };

  const handleSaveExisting = async (data: ExperienceFormData) => {
    if (!editingExperienceId) return;
    await onUpdate({ id: editingExperienceId, ...parseFormData(data) });
    setEditingExperienceId(null);
  };

  const handleDeleteExperience = async (id: string) => {
    await onDelete(id);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Experience</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost-muted"
              size="xs"
              onClick={handleCancel}
            >
              <XIcon className="w-3.5 h-3.5" />
              Done
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedExperiences.map((experience, index) =>
            editingExperienceId === experience.id ? (
              <ExperienceFormFields
                key={experience.id}
                experience={experience}
                onSave={handleSaveExisting}
                onCancel={() => setEditingExperienceId(null)}
                isLoading={isLoading}
              />
            ) : (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                isFirst={index === 0}
                isLast={index === sortedExperiences.length - 1 && !isAddingNew}
                onEdit={() => handleEditExperience(experience.id)}
                onDelete={() => handleDeleteExperience(experience.id)}
                isDeleting={isLoading}
              />
            )
          )}

          {isAddingNew ? (
            <ExperienceFormFields
              onSave={handleSaveNew}
              onCancel={() => setIsAddingNew(false)}
              isLoading={isLoading}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddNew}
              className="w-full"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add experience
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Experience</h2>
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
      {sortedExperiences.length > 0 ? (
        <div>
          {sortedExperiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              isFirst={index === 0}
              isLast={index === sortedExperiences.length - 1}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No experience added yet</p>
      )}
    </div>
  );
}
