export interface QueuedMessage {
  messageId: string;
  prompt: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface QueueStatus {
  processing: QueuedMessage | null;
  queued: QueuedMessage[];
}
