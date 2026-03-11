import { QueuedMessage } from '../queue/queue.types.js';

export interface SessionState {
  sessionId: string;
  userId: string | null; // null for guests
  threadId: string | null; // OpenAI thread ID
  messageQueue: QueuedMessage[];
  createdAt: string;
  lastActivityAt: string;
}

// Note: currentRunId is stored separately in Redis by AI Agent service
// at key: ai-match:run:${sessionId}

export interface GuestIdentifier {
  ip: string;
  fingerprint: string;
}
