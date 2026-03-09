"use client";

import { CheckIcon, ChevronRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { SeniorityLevel } from "@/lib/graphql/generated";

interface ProfileData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  techStack: string[];
  seniorityLevel: SeniorityLevel | null;
  photoPreview: string | null;
}

interface OnboardingStepCompleteProps {
  profileData: ProfileData;
  onBrowseFeed: () => void;
  isSubmitting?: boolean;
}

const seniorityLabels: Record<SeniorityLevel, string> = {
  Junior: "Junior",
  Mid: "Middle",
  Senior: "Senior",
  Lead: "Lead",
  Principal: "Principal",
};

export function OnboardingStepComplete({
  profileData,
  onBrowseFeed,
  isSubmitting = false,
}: OnboardingStepCompleteProps) {
  const { firstName, lastName, jobTitle, techStack, seniorityLevel, photoPreview } = profileData;
  const displayTechStack = techStack.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">Profile complete</span>
            </div>
          </div>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "linear-gradient(90deg, rgb(16, 185, 129) 0%, rgb(52, 211, 153) 100%)",
            }}
          />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-md overflow-hidden">
          <div className="p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckIcon className="w-9 h-9 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">
              Profile is live! 🚀
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed text-center mb-6">
              Companies can already discover you in the feed. You'll get notified when someone matches with you.
            </p>
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mb-6">
              <div
                className="h-24 pt-6 px-3 pb-3 flex items-end gap-3"
                style={{
                  backgroundImage: "linear-gradient(163deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 100%)",
                }}
              >
                <div className="w-12 h-12 rounded-xl border-2 border-white bg-white/30 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={`${firstName} ${lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-white">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-white/80">
                    {jobTitle || "Developer"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-white">
                {displayTechStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
                {seniorityLevel && (
                  <span className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg">
                    {seniorityLabels[seniorityLevel]}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="gradient"
              size="lg"
              onClick={onBrowseFeed}
              disabled={isSubmitting}
              type="button"
              className="w-full rounded-2xl font-bold"
            >
              {isSubmitting ? "Finishing..." : "Browse the feed"}
              <ChevronRightIcon className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
