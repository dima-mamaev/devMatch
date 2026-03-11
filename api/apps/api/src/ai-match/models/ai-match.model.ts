import { Field, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class AIMatchDeveloperExperience {
  @Field(() => String)
  companyName: string;

  @Field(() => String)
  position: string;

  @Field(() => Int)
  yearsWorked: number;
}

@ObjectType()
export class AIMatchDeveloperProject {
  @Field(() => String)
  name: string;

  @Field(() => [String])
  techStack: string[];
}

@ObjectType()
export class AIMatchDeveloper {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  jobTitle?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => [String])
  techStack: string[];

  @Field(() => String, { nullable: true })
  seniorityLevel?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  availabilityStatus?: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl?: string;

  @Field(() => [AIMatchDeveloperExperience])
  experiences: AIMatchDeveloperExperience[];

  @Field(() => [AIMatchDeveloperProject])
  projects: AIMatchDeveloperProject[];
}

@ObjectType()
export class AIMatchResult {
  @Field(() => String)
  developerId: string;

  @Field(() => Float)
  matchScore: number; // 0-100

  @Field(() => String)
  matchReason: string; // AI-generated explanation

  @Field(() => AIMatchDeveloper, { nullable: true })
  developer?: AIMatchDeveloper;
}

@ObjectType()
export class AIMatchResponse {
  @Field(() => [AIMatchResult])
  matches: AIMatchResult[];

  @Field(() => String)
  searchSummary: string; // AI summary of search criteria

  @Field(() => Int)
  totalCandidates: number;

  @Field(() => String, { nullable: true })
  threadId?: string; // OpenAI thread ID for conversation continuity

  @Field(() => Boolean, { defaultValue: false })
  isOffTopic: boolean; // True if prompt was not related to developer search
}

@ObjectType()
export class AIMatchRateLimitInfo {
  @Field(() => Int)
  remaining: number; // Searches remaining today

  @Field(() => Int)
  limit: number; // Total daily limit

  @Field(() => String)
  resetsAt: string; // ISO timestamp when limit resets
}

@ObjectType()
export class ConversationMatchDeveloper {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  jobTitle?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => [String])
  techStack: string[];

  @Field(() => String, { nullable: true })
  seniorityLevel?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  availabilityStatus?: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl?: string;
}

@ObjectType()
export class ConversationMatchInfo {
  @Field(() => String)
  developerId: string;

  @Field(() => Float)
  matchScore: number;

  @Field(() => String)
  matchReason: string;

  @Field(() => ConversationMatchDeveloper, { nullable: true })
  developer?: ConversationMatchDeveloper;
}

@ObjectType()
export class ConversationMessage {
  @Field(() => String)
  id: string;

  @Field(() => String)
  role: string; // 'user' | 'assistant'

  @Field(() => String)
  content: string;

  @Field(() => String)
  timestamp: string;

  @Field(() => [ConversationMatchInfo], { nullable: true })
  matches?: ConversationMatchInfo[];
}

@ObjectType()
export class AIMatchSession {
  @Field(() => String)
  sessionId: string;

  @Field(() => String)
  userType: string; // 'guest' | 'authenticated' | 'recruiter'

  @Field(() => Int)
  maxResults: number;

  @Field(() => [ConversationMessage])
  conversationHistory: ConversationMessage[];
}

@ObjectType()
export class QueuedMessageInfo {
  @Field(() => String)
  messageId: string;

  @Field(() => String)
  prompt: string;

  @Field(() => String)
  status: string; // 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'

  @Field(() => String)
  queuedAt: string;
}

@ObjectType()
export class AIMatchQueueStatus {
  @Field(() => QueuedMessageInfo, { nullable: true })
  processing?: QueuedMessageInfo;

  @Field(() => [QueuedMessageInfo])
  queued: QueuedMessageInfo[];
}

// Event type for subscriptions
@ObjectType()
export class AIMatchEventData {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  toolName?: string;

  @Field(() => String, { nullable: true })
  resultSummary?: string;

  @Field(() => Int, { nullable: true })
  candidateCount?: number;

  @Field(() => AIMatchResult, { nullable: true })
  match?: AIMatchResult;

  @Field(() => String, { nullable: true })
  summary?: string;

  @Field(() => Int, { nullable: true })
  totalMatches?: number;

  @Field(() => Int, { nullable: true })
  totalCandidates?: number;

  @Field(() => Int, { nullable: true })
  position?: number;

  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => Boolean, { nullable: true })
  isOffTopic?: boolean;
}

@ObjectType()
export class AIMatchEvent {
  @Field(() => String)
  type: string; // AIMatchEventType

  @Field(() => String)
  sessionId: string;

  @Field(() => String)
  messageId: string;

  @Field(() => String)
  timestamp: string;

  @Field(() => AIMatchEventData, { nullable: true })
  data?: AIMatchEventData;
}
