import { QueuedMessage } from '../queue/queue.types.js';

export interface ConversationMatchDeveloper {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  bio?: string;
  techStack: string[];
  seniorityLevel?: string;
  location?: string;
  availabilityStatus?: string;
  profilePhotoUrl?: string;
}

export interface ConversationMatch {
  developerId: string;
  matchScore: number;
  matchReason: string;
  developer?: ConversationMatchDeveloper;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  matches?: ConversationMatch[];
}

export interface SessionState {
  sessionId: string;
  userId: string | null; // null for guests
  threadId: string | null; // OpenAI thread ID
  messageQueue: QueuedMessage[];
  conversationHistory: ConversationMessage[];
  createdAt: string;
  lastActivityAt: string;
}

// Note: currentRunId is stored separately in Redis by AI Agent service
// at key: ai-match:run:${sessionId}

export interface GuestIdentifier {
  ip: string;
  fingerprint: string;
}
