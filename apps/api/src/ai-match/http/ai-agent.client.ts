import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface MatchingRequest {
  sessionId: string;
  messageId: string;
  prompt: string;
  threadId?: string;
  excludeIds?: string[];
  maxResults?: number;
}

interface MatchingResponse {
  success: boolean;
  threadId: string;
  message: string;
}

interface CancelRequest {
  sessionId: string;
  threadId: string;
  runId: string;
}

interface CancelResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class AIAgentClient {
  private readonly logger = new Logger(AIAgentClient.name);
  private readonly baseUrl: string;
  private readonly MAX_RETRIES = 3;
  private readonly INITIAL_DELAY_MS = 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'AI_AGENT_URL',
      'http://localhost:4001',
    );
  }

  async runMatchingAgent(request: MatchingRequest): Promise<MatchingResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<MatchingResponse>(
            `${this.baseUrl}/api/match`,
            request,
          ),
        );
        return response.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        this.logger.warn(
          `AI Agent call failed (attempt ${attempt}/${this.MAX_RETRIES}): ${lastError.message}`,
        );

        if (attempt < this.MAX_RETRIES) {
          const delay = this.INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(`AI Agent unavailable after ${this.MAX_RETRIES} attempts`);
    throw new Error('AI matching temporarily unavailable, please try again later');
  }

  async cancelRun(request: CancelRequest): Promise<CancelResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<CancelResponse>(
            `${this.baseUrl}/api/cancel`,
            request,
          ),
        );
        return response.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        this.logger.warn(
          `Cancel run failed (attempt ${attempt}/${this.MAX_RETRIES}): ${lastError.message}`,
        );

        if (attempt < this.MAX_RETRIES) {
          const delay = this.INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(`Cancel run unavailable after ${this.MAX_RETRIES} attempts`);
    throw new Error('Cancel operation temporarily unavailable, please try again later');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
