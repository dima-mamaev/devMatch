"use client";

import { ChatMessage as ChatMessageType, DeveloperMatch } from "@/hooks/useAIMatch";
import { DeveloperMatchCard } from "./DeveloperMatchCard";
import { AIWorkingIndicator } from "./AIWorkingIndicator";
import { SparklesIcon } from "@/components/icons";

interface ChatMessageProps {
  message: ChatMessageType;
  onAddToShortlist?: (developerId: string) => void;
  onViewProfile?: (developerId: string) => void;
}

export function ChatMessage({
  message,
  onAddToShortlist,
  onViewProfile,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Error state */}
          {message.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
              <p className="text-sm text-red-600">{message.error}</p>
            </div>
          )}

          {/* AI Working indicator */}
          {message.isStreaming && (
            <div className="mb-3">
              <AIWorkingIndicator />
            </div>
          )}

          {/* Developer matches */}
          {message.matches && message.matches.length > 0 && (
            <div className="space-y-3 mb-3">
              {message.matches.map((match: DeveloperMatch, index: number) => (
                <DeveloperMatchCard
                  key={match.developerId}
                  match={match}
                  rank={index + 1}
                  onAddToShortlist={onAddToShortlist}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          )}

          {/* Summary text */}
          {message.content && !message.isStreaming && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
