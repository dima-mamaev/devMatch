"use client";

import { useConnectionStatus } from "@/providers/ApolloProvider";

export function ConnectionStatus() {
  const { isConnected, isReconnecting, lastError } = useConnectionStatus();

  // Don't show anything if connected
  if (isConnected && !isReconnecting) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isReconnecting && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm text-yellow-700">Reconnecting...</span>
        </div>
      )}
      {!isConnected && !isReconnecting && lastError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg shadow-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-sm text-red-700">Connection lost</span>
        </div>
      )}
    </div>
  );
}
