export enum AIMatchEventType {
  CONNECTED = 'CONNECTED',
  MESSAGE_QUEUED = 'MESSAGE_QUEUED',
  MESSAGE_STARTED = 'MESSAGE_STARTED',
  THINKING = 'THINKING',
  TOOL_CALL = 'TOOL_CALL',
  TOOL_RESULT = 'TOOL_RESULT',
  MATCH_FOUND = 'MATCH_FOUND',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED',
  RATE_LIMITED = 'RATE_LIMITED',
}

export interface AIMatchEvent {
  type: AIMatchEventType;
  sessionId: string;
  messageId: string;
  timestamp: string;
  data?: Record<string, any>;
}

export function createEvent(
  type: AIMatchEventType,
  sessionId: string,
  messageId: string,
  data?: Record<string, any>,
): AIMatchEvent {
  return {
    type,
    sessionId,
    messageId,
    timestamp: new Date().toISOString(),
    data,
  };
}
