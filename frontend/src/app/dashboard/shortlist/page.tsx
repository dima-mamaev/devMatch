"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  GithubIcon,
  LinkedinIcon,
  UserIcon,
  TrashIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@/components/icons";
import { useShortlist } from "@/hooks/useShortlist";
import { useGetDeveloperLazyQuery, GetDeveloperQuery } from "@/lib/graphql/generated";

type Developer = NonNullable<GetDeveloperQuery["getDeveloper"]>;

export default function ShortlistPage() {
  const {
    shortlist,
    localShortlistIds,
    shortlistLoading,
    shortlistCount,
    maxSize,
    removeFromShortlist,
    isLoading,
    isLocalMode,
  } = useShortlist();

  const [localDevelopers, setLocalDevelopers] = useState<Developer[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [getDeveloper] = useGetDeveloperLazyQuery();
  const getDeveloperRef = useRef(getDeveloper);

  getDeveloperRef.current = getDeveloper;

  const fetchLocalDevelopers = useCallback(async (ids: string[]) => {
    setLocalLoading(true);
    try {
      const results = await Promise.all(
        ids.map((id) => getDeveloperRef.current({ variables: { id } }))
      );

      const developers = results
        .map((result) => result.data?.getDeveloper)
        .filter((dev): dev is Developer => dev != null);

      setLocalDevelopers(developers);
    } catch (error) {
      console.error("Failed to fetch local shortlist developers:", error);
    } finally {
      setLocalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLocalMode || localShortlistIds.length === 0) {
      setLocalDevelopers([]);
      return;
    }

    fetchLocalDevelopers(localShortlistIds);
  }, [isLocalMode, localShortlistIds, fetchLocalDevelopers]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`.trim();
  };

  const formatSeniorityLevel = (level: string) => {
    return level.replace(/_/g, " ");
  };

  const handleRemove = async (developerId: string) => {
    await removeFromShortlist(developerId);
  };

  const loading = shortlistLoading || localLoading;
  const isEmpty = isLocalMode
    ? localDevelopers.length === 0
    : shortlist.length === 0;

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-bold text-slate-900">Shortlist</h1>
          <p className="text-xs text-slate-400">
            {loading
              ? "Loading..."
              : `${shortlistCount} developers shortlisted`
            }
          </p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              No developers shortlisted
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Save developers from the feed to add them to your shortlist.
            </p>
            <Link
              href="/dashboard/developers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse Developers
            </Link>
          </div>
        ) : isLocalMode ? (
          <div className="space-y-4">
            {localDevelopers.map((developer) => {
              const fullName = getFullName(developer.firstName, developer.lastName);
              return (
                <div
                  key={developer.id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      {developer.profilePhoto?.url ? (
                        <img
                          src={developer.profilePhoto.url}
                          alt={fullName}
                          className="w-14 h-14 rounded-full border-2 border-slate-100 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-slate-100 bg-indigo-500 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {getInitials(developer.firstName, developer.lastName)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
                      <p className="text-sm text-slate-500">
                        {developer.jobTitle || "Developer"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {developer.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPinIcon className="w-3 h-3" />
                            {developer.location}
                          </div>
                        )}
                        {developer.seniorityLevel && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <BriefcaseIcon className="w-3 h-3" />
                            {formatSeniorityLevel(developer.seniorityLevel)}
                          </div>
                        )}
                      </div>
                      {developer.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {developer.techStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                          {developer.techStack.length > 5 && (
                            <span className="px-2 py-1 text-xs text-slate-400">
                              +{developer.techStack.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col gap-2">
                      <div className="flex gap-2">
                        {developer.githubUrl && (
                          <a
                            href={developer.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50"
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
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50"
                          >
                            <LinkedinIcon className="w-3 h-3" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/developers/${developer.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <UserIcon className="w-3 h-3" />
                          Profile
                        </Link>
                        <button
                          onClick={() => handleRemove(developer.id)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <TrashIcon className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  {developer.bio && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {developer.bio}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {shortlist.map((entry) => {
              const developer = entry.developer;
              const fullName = getFullName(developer.firstName, developer.lastName);
              return (
                <div
                  key={entry.id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      {developer.profilePhoto?.url ? (
                        <img
                          src={developer.profilePhoto.url}
                          alt={fullName}
                          className="w-14 h-14 rounded-full border-2 border-slate-100 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-slate-100 bg-indigo-500 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {getInitials(developer.firstName, developer.lastName)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
                      <p className="text-sm text-slate-500">
                        {developer.jobTitle || "Developer"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {developer.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPinIcon className="w-3 h-3" />
                            {developer.location}
                          </div>
                        )}
                        {developer.seniorityLevel && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <BriefcaseIcon className="w-3 h-3" />
                            {formatSeniorityLevel(developer.seniorityLevel)}
                          </div>
                        )}
                      </div>
                      {developer.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {developer.techStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                          {developer.techStack.length > 5 && (
                            <span className="px-2 py-1 text-xs text-slate-400">
                              +{developer.techStack.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col gap-2">
                      <div className="flex gap-2">
                        {developer.githubUrl && (
                          <a
                            href={developer.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50"
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
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50"
                          >
                            <LinkedinIcon className="w-3 h-3" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/developers/${developer.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <UserIcon className="w-3 h-3" />
                          Profile
                        </Link>
                        <button
                          onClick={() => handleRemove(developer.id)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <TrashIcon className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  {developer.bio && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {developer.bio}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
