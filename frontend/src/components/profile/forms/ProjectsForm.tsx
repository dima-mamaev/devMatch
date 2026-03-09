"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  SparklesIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  ExternalLinkIcon,
  TrashIcon
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Project } from "@/lib/graphql/generated";

export interface ProjectFormData {
  name: string;
  description: string;
  url: string;
  techStack: string;
}

export interface AddProjectData {
  name: string;
  description: string | null;
  url: string | null;
  techStack: string[];
}

export interface UpdateProjectData extends AddProjectData {
  id: string;
}

interface ProjectsFormProps {
  projects: Array<Pick<Project, 'id' | 'name' | 'description' | 'url' | 'techStack'>>;
  onAdd: (data: AddProjectData) => Promise<void>;
  onUpdate: (data: UpdateProjectData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  isDeleting
}: {
  project: Pick<Project, 'id' | 'name' | 'description' | 'url' | 'techStack'>;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="border border-slate-200 rounded-[14px] p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-bold text-slate-900">{project.name}</p>
        <div className="flex items-center gap-2">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          )}
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
      {project.description && (
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          {project.description}
        </p>
      )}
      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
  isLoading,
}: {
  project?: Pick<Project, 'id' | 'name' | 'description' | 'url' | 'techStack'>;
  onSave: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      url: project?.url || "",
      techStack: project?.techStack.join(", ") || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="border border-slate-200 rounded-[14px] p-4 space-y-3">
      <Input
        label="Project name"
        {...register("name", {
          required: "Project name is required",
          validate: (value) => value.trim() !== "" || "Project name is required"
        })}
        error={errors.name?.message}
      />
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={2}
          className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      <Input
        label="URL"
        placeholder="https://..."
        {...register("url")}
        error={errors.url?.message}
      />
      <Input
        label="Tech stack"
        placeholder="React, Node.js, PostgreSQL"
        {...register("techStack")}
      />
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

export function ProjectsForm({ projects, onAdd, onUpdate, onDelete, isLoading = false }: ProjectsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingProjectId(null);
    setIsAddingNew(true);
  };

  const handleEditProject = (id: string) => {
    setIsAddingNew(false);
    setEditingProjectId(id);
  };

  const parseFormData = (data: ProjectFormData) => {
    const techStack = data.techStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    return {
      name: data.name.trim(),
      description: data.description.trim() || null,
      url: data.url.trim() || null,
      techStack,
    };
  };

  const handleSaveNew = async (data: ProjectFormData) => {
    await onAdd(parseFormData(data));
    setIsAddingNew(false);
  };

  const handleSaveExisting = async (data: ProjectFormData) => {
    if (!editingProjectId) return;
    await onUpdate({ id: editingProjectId, ...parseFormData(data) });
    setEditingProjectId(null);
  };

  const handleDeleteProject = async (id: string) => {
    await onDelete(id);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Projects</h2>
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
          {projects.map((project) => (
            editingProjectId === project.id ? (
              <ProjectForm
                key={project.id}
                project={project}
                onSave={handleSaveExisting}
                onCancel={() => setEditingProjectId(null)}
                isLoading={isLoading}
              />
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleEditProject(project.id)}
                onDelete={() => handleDeleteProject(project.id)}
                isDeleting={isLoading}
              />
            )
          ))}

          {isAddingNew ? (
            <ProjectForm
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
              Add project
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
          <SparklesIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Projects</h2>
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
      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No projects added yet</p>
      )}
    </div>
  );
}
