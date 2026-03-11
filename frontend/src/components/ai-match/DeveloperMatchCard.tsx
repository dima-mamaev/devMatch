"use client";

import { DeveloperMatch } from "@/hooks/useAIMatch";
import Image from "next/image";

interface DeveloperMatchCardProps {
  match: DeveloperMatch;
  rank: number;
  onAddToShortlist?: (developerId: string) => void;
  onViewProfile?: (developerId: string) => void;
}

export function DeveloperMatchCard({
  match,
  rank,
  onAddToShortlist,
  onViewProfile,
}: DeveloperMatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-lime-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case "OpenToWork":
        return { label: "Open to work", className: "bg-emerald-50 text-emerald-700" };
      case "OpenToOffers":
        return { label: "Open to offers", className: "bg-blue-50 text-blue-700" };
      case "NotAvailable":
        return { label: "Not available", className: "bg-slate-100 text-slate-600" };
      default:
        return null;
    }
  };

  const availability = getAvailabilityBadge(match.availabilityStatus);
  const techStack = match.techStack || [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
      <div className="flex gap-4">
        {/* Rank badge */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-slate-600">#{rank}</span>
          </div>
        </div>

        {/* Profile photo */}
        <div className="flex-shrink-0">
          {match.profilePhotoUrl ? (
            <Image
              src={match.profilePhotoUrl}
              alt={`${match.firstName || ""} ${match.lastName || ""}`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">
                {match.firstName?.[0] || "?"}
                {match.lastName?.[0] || ""}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-slate-900">
                {match.firstName} {match.lastName}
              </h4>
              {match.jobTitle && (
                <p className="text-sm text-slate-500">{match.jobTitle}</p>
              )}
              {match.location && (
                <p className="text-xs text-slate-400 mt-0.5">{match.location}</p>
              )}
            </div>

            {/* Match score */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${getScoreColor(match.score)}`} />
              <span className="text-sm font-semibold text-slate-700">
                {match.score}%
              </span>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {match.seniorityLevel && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                {match.seniorityLevel}
              </span>
            )}
            {availability && (
              <span className={`px-2 py-0.5 text-xs rounded-md ${availability.className}`}>
                {availability.label}
              </span>
            )}
          </div>

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-md"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 5 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                  +{techStack.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Reasoning */}
          {match.reasoning && (
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {match.reasoning}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onViewProfile?.(match.developerId)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={() => onAddToShortlist?.(match.developerId)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Add to Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
