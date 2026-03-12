import { QueuedMessage } from '../queue/queue.types.js';

export interface DeveloperExperience {
  companyName: string;
  position: string;
  yearsWorked: number;
}

export interface DeveloperProject {
  name: string;
  techStack: string[];
}

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
  experiences?: DeveloperExperience[];
  projects?: DeveloperProject[];
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

export interface GuestIdentifier {
  ip: string;
  fingerprint: string;
}
