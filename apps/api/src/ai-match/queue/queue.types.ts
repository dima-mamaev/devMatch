export type MessageStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface QueuedMessage {
  messageId: string;
  prompt: string;
  status: MessageStatus;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface QueueStatus {
  processing: QueuedMessage | null;
  queued: QueuedMessage[];
}
