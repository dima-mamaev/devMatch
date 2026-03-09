"use client";

import Link from "next/link";
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  UserIcon,
  TrashIcon,
} from "@/components/icons";

interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  location?: string | null;
  seniorityLevel?: string | null;
  techStack: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  bio?: string | null;
  profilePhoto?: { url: string } | null;
}

interface ShortlistCardProps {
  developer: Developer;
  onRemove: (developerId: string) => void;
  isLoading?: boolean;
}

const SENIORITY_YEARS: Record<string, string> = {
  Junior: "0-2 yrs",
  Mid: "2-4 yrs",
  Senior: "4-8 yrs",
  Lead: "8-12 yrs",
  Principal: "12+ yrs",
};

export function ShortlistCard({
  developer,
  onRemove,
  isLoading = false,
}: ShortlistCardProps) {
  const fullName = `${developer.firstName} ${developer.lastName}`.trim();
  const initials =
    `${developer.firstName?.[0] || ""}${developer.lastName?.[0] || ""}`.toUpperCase() || "?";

  const experienceText = developer.seniorityLevel
    ? SENIORITY_YEARS[developer.seniorityLevel] || developer.seniorityLevel
    : null;

  const locationExperience = [developer.location, experienceText ? `${experienceText} experience` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      {/* Main content row */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {developer.profilePhoto?.url ? (
            <img
              src={developer.profilePhoto.url}
              alt={fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-100">
              <span className="text-lg font-bold text-white">{initials}</span>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {developer.jobTitle || "Developer"}
          </p>
          {locationExperience && (
            <p className="text-xs text-slate-400 mt-0.5">{locationExperience}</p>
          )}
          {/* Tech Stack */}
          {developer.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {developer.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
              {developer.techStack.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-slate-400">
                  +{developer.techStack.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions section */}
        <div className="shrink-0 flex flex-col gap-2">
          {/* Social links row */}
          <div className="flex gap-2">
            {developer.githubUrl && (
              <a
                href={developer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-[10px] text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <GithubIcon className="w-3 h-3" />
                GitHub
              </a>
            )}
            {developer.linkedinUrl && (
              <a
                href={developer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-[10px] text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <LinkedinIcon className="w-3 h-3" />
                LinkedIn
              </a>
            )}
            {developer.email && (
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-[10px] text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <MailIcon className="w-3 h-3" />
                Email
              </a>
            )}
          </div>
          {/* Action buttons row */}
          <div className="flex gap-2">
            <Link
              href={`/dashboard/developers/${developer.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-[10px] text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <UserIcon className="w-3 h-3" />
              Profile
            </Link>
            <button
              onClick={() => onRemove(developer.id)}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-[10px] text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <TrashIcon className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Bio section */}
      {developer.bio && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {developer.bio}
          </p>
        </div>
      )}
    </div>
  );
}
