"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Analyzing your request",
  "Searching the talent pool",
  "Evaluating candidates",
  "Finding the best matches",
  "Reviewing profiles",
  "Scoring compatibility",
  "Comparing skills",
  "Processing results",
];

export function AIWorkingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through phrases every 3 seconds
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(phraseInterval);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl w-fit">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-30" />
        <div className="absolute inset-0.5 bg-indigo-500 rounded-full" />
      </div>
      <span className="text-sm text-slate-600 font-medium min-w-[180px]">
        {phrases[phraseIndex]}
        <span className="inline-block w-6 text-left">{dots}</span>
      </span>
    </div>
  );
}
