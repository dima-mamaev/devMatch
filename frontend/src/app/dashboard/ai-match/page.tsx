"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SparklesIcon, SendIcon, StopIcon, RefreshIcon } from "@/components/icons";
import { ChatMessage, ConnectionStatus } from "@/components/ai-match";
import { useAIMatch } from "@/hooks/useAIMatch";
import { useMutation } from "@apollo/client";
import { ADD_TO_SHORTLIST } from "@/lib/graphql/operations";
import { toast } from "sonner";

const examplePrompts = [
  "I need a senior Next.js + NestJS developer for a SaaS marketplace.",
  "Looking for a mobile developer with React Native and Firebase experience.",
  "We need a backend engineer skilled in distributed systems and Go.",
  "Find me a frontend lead who knows Vue.js and GraphQL.",
];

export default function AIMatchPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    sessionId,
    messages,
    isLoading,
    isProcessing,
    error,
    rateLimitInfo,
    userType,
    sendMessage,
    cancelCurrent,
    clearMessages,
  } = useAIMatch();

  const [addToShortlist] = useMutation(ADD_TO_SHORTLIST);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    textareaRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;
    const messageToSend = prompt;
    setPrompt("");
    await sendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAddToShortlist = async (developerId: string) => {
    try {
      await addToShortlist({ variables: { developerId } });
      toast.success("Developer added to shortlist");
    } catch (err) {
      console.error("Failed to add to shortlist:", err);
      toast.error("Failed to add to shortlist");
    }
  };

  const handleViewProfile = (developerId: string) => {
    router.push(`/dashboard/developers/${developerId}`);
  };

  const hasMessages = messages.length > 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-50 rounded-[10px] flex items-center justify-center">
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">AI Matching Assistant</h1>
            <p className="text-xs text-slate-400">Describe your role, get a ranked shortlist</p>
          </div>
        </div>

        {/* Rate limit info */}
        <div className="flex items-center gap-4">
          {rateLimitInfo && (
            <div className="text-xs text-slate-500">
              <span className="font-medium">{rateLimitInfo.remaining}</span>
              <span className="text-slate-400">/{rateLimitInfo.limit} searches left</span>
            </div>
          )}
          {hasMessages && (
            <button
              onClick={() => clearMessages(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              New chat
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-56px)]">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            // Loading state while session is being restored
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading conversation...</p>
              </div>
            </div>
          ) : !hasMessages ? (
            // Empty state
            <div className="flex items-center justify-center h-full">
              <div className="max-w-lg w-full text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Find your perfect developer
                </h2>
                <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                  Describe your project requirements in plain English. Our AI will analyze the
                  developer pool and return a ranked shortlist with detailed reasoning.
                </p>

                {/* User type badge */}
                {userType && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600 mb-6">
                    {userType === "guest" && "Guest mode - limited features"}
                    {userType === "authenticated" && "Free tier - 20 searches/day"}
                    {userType === "recruiter" && "Pro tier - unlimited searches"}
                  </div>
                )}

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
          ) : (
            // Chat messages
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onAddToShortlist={handleAddToShortlist}
                  onViewProfile={handleViewProfile}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Input area */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your ideal developer or project requirements..."
                rows={1}
                disabled={isLoading || !sessionId}
                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:opacity-50"
              />
              {isProcessing ? (
                <button
                  onClick={cancelCurrent}
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Stop"
                >
                  <StopIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading || !sessionId}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    prompt.trim() && !isLoading && sessionId
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-600 text-white opacity-40 cursor-not-allowed"
                  }`}
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
      <ConnectionStatus />
    </DashboardLayout>
  );
}
