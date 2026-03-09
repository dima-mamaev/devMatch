"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ActionButton } from "@/components/ui/ActionButton";
import { ActionLink } from "@/components/ui/ActionLink";
import {
  BookmarkIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  VolumeIcon,
  VolumeMuteIcon,
  MapPinIcon,
  BriefcaseIcon,
  PlayIcon,
} from "@/components/icons";
import { useGetDevelopersQuery } from "@/lib/graphql/generated";
import { useShortlist } from "@/hooks/useShortlist";
import { useDeveloperProfile } from "@/hooks/useUser";

const SENIORITY_YEARS: Record<string, string> = {
  Junior: "0-2 yrs",
  Mid: "2-4 yrs",
  Senior: "4-8 yrs",
  Lead: "8-12 yrs",
  Principal: "12+ yrs",
};

export default function DashboardPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const currentDeveloperProfile = useDeveloperProfile();
  const { isInShortlist, toggleShortlist, isLoading: shortlistLoading } = useShortlist();

  const { data, loading } = useGetDevelopersQuery({
    variables: {
      paging: { page: 1, limit: 20 },
      filter: {
        excludeIds: currentDeveloperProfile?.id ? [currentDeveloperProfile.id] : undefined,
        hasIntroVideo: true,
      },
    },
  });

  const developers = data?.getDevelopers?.results ?? [];
  const totalCount = developers.length;
  const currentDeveloper = developers[currentIndex];

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, totalCount]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "m") {
        handleMuteToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext, handleMuteToggle]);

  const experienceText = currentDeveloper?.seniorityLevel
    ? SENIORITY_YEARS[currentDeveloper.seniorityLevel] + " exp"
    : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-bold text-slate-900">Developer Feed</h1>
          <p className="text-xs text-slate-400">
            {loading ? "Loading..." : `${currentIndex + 1} of ${totalCount} developers`}
          </p>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-1.5">
            {developers.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all ${
                  i === currentIndex
                    ? "w-5 h-1.5 bg-indigo-600"
                    : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-slate-50">
        {loading ? (
          <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
        ) : totalCount === 0 ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              No video introductions yet
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Developers with video introductions will appear here.
            </p>
            <Link
              href="/dashboard/developers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse All Developers
            </Link>
          </div>
        ) : currentDeveloper ? (
          <div className="flex items-center gap-5">
            {/* Video Card with Navigation */}
            <div className="flex flex-col items-center gap-3">
              {/* Up Arrow */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronUpIcon className="w-4 h-4 text-slate-600" />
              </button>

              {/* Video Card */}
              <div className="relative w-[340px] h-[604px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                {/* Video Player */}
                {currentDeveloper.introVideo?.url && (
                  <VideoPlayer
                    key={currentDeveloper.id}
                    url={currentDeveloper.introVideo.url}
                    thumbnail={currentDeveloper.introVideoThumbnail?.url}
                    className="w-full h-full"
                    aspectRatio="portrait"
                    muted={isMuted}
                    loop
                    controls={false}
                  />
                )}

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(rgba(0,0,0,0.1) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.75) 100%)",
                  }}
                />

                {/* Mute Button */}
                <button
                  onClick={handleMuteToggle}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
                >
                  {isMuted ? (
                    <VolumeMuteIcon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <VolumeIcon className="w-3.5 h-3.5 text-white" />
                  )}
                </button>

                {/* Developer Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-lg font-bold text-white">
                    {currentDeveloper.firstName} {currentDeveloper.lastName}
                  </h2>
                  <p className="text-sm text-white/80 mt-0.5">
                    {currentDeveloper.jobTitle || "Developer"}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                    {currentDeveloper.location && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{currentDeveloper.location}</span>
                      </div>
                    )}
                    {currentDeveloper.location && experienceText && (
                      <span className="opacity-60">·</span>
                    )}
                    {experienceText && (
                      <div className="flex items-center gap-1">
                        <BriefcaseIcon className="w-3 h-3" />
                        <span>{experienceText}</span>
                      </div>
                    )}
                  </div>
                  {currentDeveloper.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {currentDeveloper.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-white/20 rounded-lg text-xs text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Down Arrow */}
              <button
                onClick={handleNext}
                disabled={currentIndex === totalCount - 1}
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronDownIcon className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Action Buttons */}
              <div className="flex flex-col gap-5">
                {/* Save/Shortlist */}
                <ActionButton
                  onClick={() => toggleShortlist(currentDeveloper.id)}
                  disabled={shortlistLoading}
                  active={isInShortlist(currentDeveloper.id)}
                  label="Save"
                  icon={<BookmarkIcon className="w-5 h-5" />}
                />

                {/* GitHub */}
                {currentDeveloper.githubUrl && (
                  <ActionLink
                    href={currentDeveloper.githubUrl}
                    label="GitHub"
                    icon={<GithubIcon className="w-5 h-5" />}
                  />
                )}

                {/* LinkedIn */}
                {currentDeveloper.linkedinUrl && (
                  <ActionLink
                    href={currentDeveloper.linkedinUrl}
                    label="LinkedIn"
                    icon={<LinkedinIcon className="w-5 h-5" />}
                  />
                )}

                {/* Email */}
                <ActionLink
                  href={`mailto:contact@devmatch.io?subject=Interested in ${currentDeveloper.firstName}`}
                  label="Email"
                  icon={<MailIcon className="w-5 h-5" />}
                />

                {/* Profile */}
                <ActionLink
                  href={`/dashboard/developers/${currentDeveloper.id}`}
                  label="Profile"
                  icon={<UserIcon className="w-5 h-5" />}
                  internal
                />
              </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
