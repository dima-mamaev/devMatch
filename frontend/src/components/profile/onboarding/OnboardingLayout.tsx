"use client";

import { CheckIcon } from "@/components/icons";

export type OnboardingStepId =
  | "photo-name"
  | "role-location"
  | "experience"
  | "tech-stack"
  | "links-bio"
  | "intro-video";

interface OnboardingStep {
  id: OnboardingStepId;
  number: number;
  label: string;
}

const steps: OnboardingStep[] = [
  { id: "photo-name", number: 1, label: "Photo & name" },
  { id: "role-location", number: 2, label: "Role & location" },
  { id: "experience", number: 3, label: "Experience" },
  { id: "tech-stack", number: 4, label: "Tech stack" },
  { id: "links-bio", number: 5, label: "Links & bio" },
  { id: "intro-video", number: 6, label: "Intro video" },
];

interface OnboardingLayoutProps {
  currentStep: OnboardingStepId;
  children: React.ReactNode;
}

export function OnboardingLayout({ currentStep, children }: OnboardingLayoutProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="hidden md:flex items-center gap-1">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isPast = index < currentStepIndex;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${isActive
                          ? "bg-indigo-600 text-white"
                          : isPast
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-400"
                          }`}
                      >
                        {isPast ? (
                          <CheckIcon className="w-3.5 h-3.5" />
                        ) : (
                          step.number
                        )}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 lg:w-6 h-0.5 mx-2 rounded-full transition-colors ${isPast ? "bg-indigo-600" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <div className="flex gap-1">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${index <= currentStepIndex ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              backgroundImage: "linear-gradient(90deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 100%)",
            }}
          />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
