"use client";

import Link from "next/link";
import {
  MapPinIcon,
  UserIcon,
  BriefcaseIcon,
  GithubIcon,
  LinkedinIcon,
  BookmarkIcon,
  TrashIcon,
} from "@/components/icons";

export interface DeveloperPreviewData {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  bio?: string | null;
  location?: string | null;
  seniorityLevel?: string | null;
  techStack: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  profilePhoto?: { url: string } | null;
}

interface DeveloperPreviewCardProps {
  developer: DeveloperPreviewData;
  isShortlisted?: boolean;
  isShortlistFull?: boolean;
  isLoading?: boolean;
  onToggleShortlist?: (developerId: string) => void;
  onRemove?: (developerId: string) => void;
  showActions?: boolean;
}

export function DeveloperPreviewCard({
  developer,
  isShortlisted = false,
  isShortlistFull = false,
  isLoading = false,
  onToggleShortlist,
  onRemove,
  showActions = true,
}: DeveloperPreviewCardProps) {
  const fullName = `${developer.firstName} ${developer.lastName}`.trim();
  const initials = `${developer.firstName?.[0] || ""}${developer.lastName?.[0] || ""}`.toUpperCase() || "?";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      {/* Header - Avatar + Name */}
      <div className="flex gap-3">
        <div className="shrink-0">
          {developer.profilePhoto?.url ? (
            <img
              src={developer.profilePhoto.url}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-100">
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
          <p className="text-xs text-slate-500">
            {developer.jobTitle || "Developer"}
          </p>
        </div>
      </div>

      {/* Location & Seniority */}
      <div className="flex flex-col gap-1.5 mt-4">
        {developer.location && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPinIcon className="w-3 h-3" />
            {developer.location}
          </div>
        )}
        {developer.seniorityLevel && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BriefcaseIcon className="w-3 h-3" />
            {developer.seniorityLevel.replace(/_/g, " ")}
          </div>
        )}
      </div>

      {/* Tech Stack */}
      {developer.techStack.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {developer.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>
          {developer.techStack.length > 4 && (
            <span className="inline-block mt-1.5 px-2 text-xs text-slate-400">
              +{developer.techStack.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Bio */}
      {developer.bio && (
        <p className="text-xs text-slate-500 leading-relaxed mt-4 line-clamp-3">
          {developer.bio}
        </p>
      )}

      {/* Social Links */}
      <div className="flex items-center gap-1.5 mt-4">
        {developer.githubUrl && (
          <a
            href={developer.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        )}
        {developer.linkedinUrl && (
          <a
            href={developer.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 mt-4">
          <Link
            href={`/dashboard/developers/${developer.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 rounded-[14px] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <UserIcon className="w-3 h-3" />
            Profile
          </Link>
          {onRemove ? (
            <button
              onClick={() => onRemove(developer.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-red-200 rounded-[14px] text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-3 h-3" />
              Remove
            </button>
          ) : onToggleShortlist ? (
            <button
              onClick={() => onToggleShortlist(developer.id)}
              disabled={isLoading || (isShortlistFull && !isShortlisted)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-[14px] text-xs font-semibold text-white transition-colors disabled:opacity-50 ${
                isShortlisted
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              title={
                isShortlistFull && !isShortlisted
                  ? "Shortlist is full (max 5)"
                  : isShortlisted
                    ? "Remove from shortlist"
                    : "Add to shortlist"
              }
            >
              <BookmarkIcon className="w-3 h-3" />
              {isShortlisted ? "Shortlisted" : "Shortlist"}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
