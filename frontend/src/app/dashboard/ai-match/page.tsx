"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SparklesIcon, SendIcon } from "@/components/icons";

const examplePrompts = [
  "I need a senior Next.js + NestJS developer for a SaaS marketplace.",
  "Looking for a mobile developer with React Native and Firebase experience.",
  "We need a backend engineer skilled in distributed systems and Go.",
  "Find me a frontend lead who knows Vue.js and GraphQL.",
];

export default function AIMatchPage() {
  const [prompt, setPrompt] = useState("");

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // TODO: Implement AI matching
    console.log("Submitting prompt:", prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 h-14 flex items-center px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-50 rounded-[10px] flex items-center justify-center">
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">AI Matching Assistant</h1>
            <p className="text-xs text-slate-400">Describe your role, get a ranked shortlist</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100vh-56px)]">
        {/* Main Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full text-center">
            {/* Icon */}
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-indigo-600" />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Find your perfect developer
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
              Describe your project requirements in plain English. Our AI will analyze the
              developer pool and return a ranked shortlist with detailed reasoning.
            </p>

            {/* Example Prompts */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Try an example
              </p>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    &ldquo;{example}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your ideal developer or project requirements..."
                rows={1}
                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  prompt.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white opacity-40 cursor-not-allowed"
                }`}
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
