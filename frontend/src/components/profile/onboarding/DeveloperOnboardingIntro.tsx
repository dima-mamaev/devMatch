"use client";

import { SparklesIcon, ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

interface DeveloperOnboardingIntroProps {
  onStart: () => void;
}

const steps = [
  { emoji: "📸", label: "Profile photo & basic info" },
  { emoji: "⚡", label: "Skills, experience & links" },
  { emoji: "🎬", label: "Short intro video (the secret weapon)" },
];

export function DeveloperOnboardingIntro({ onStart }: DeveloperOnboardingIntroProps) {

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-slate-50 p-6">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-115 p-8">
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backgroundImage: "linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 100%)",
            }}
          >
            <SparklesIcon className="w-9 h-9 text-white" />
          </div>
        </div>
        <h1 className="text-[28px] font-extrabold text-slate-900 text-center leading-tight">
          Build your dev profile
        </h1>
        <p className="text-slate-500 text-center mt-2 leading-relaxed">
          Companies browse DevMatch like a feed.{" "}
          A great profile with an intro video gets{" "}
          <span className="font-semibold text-indigo-600">12× more interviews</span>.
        </p>
        <div className="flex flex-col gap-3 mt-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5"
            >
              <span className="text-xl">{step.emoji}</span>
              <span className="text-sm font-medium text-slate-700">{step.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center mt-6">
          Takes about 5 minutes · You can edit anytime
        </p>
        <div className="flex justify-center mt-6">
          <Button
            variant="gradient"
            size="lg"
            onClick={onStart}
            type="button"
            className="rounded-2xl font-bold"
          >
            Let's go
            <ArrowRightIcon className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
