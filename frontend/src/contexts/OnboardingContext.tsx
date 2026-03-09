"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextValue {
  showComplete: boolean;
  setShowComplete: (show: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showComplete, setShowComplete] = useState(false);

  return (
    <OnboardingContext.Provider value={{ showComplete, setShowComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
