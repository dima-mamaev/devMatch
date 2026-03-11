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

interface HealthResponse {
  healthy: boolean;
  openaiStatus: string;
}

@Injectable()
export class AIAgentClient {
  private readonly logger = new Logger(AIAgentClient.name);
  private readonly baseUrl: string;

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
    try {
      const response = await firstValueFrom(
        this.httpService.post<MatchingResponse>(
          `${this.baseUrl}/api/match`,
          request,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to call AI Agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  async cancelRun(request: CancelRequest): Promise<CancelResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<CancelResponse>(
          `${this.baseUrl}/api/cancel`,
          request,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to cancel run: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<HealthResponse>(`${this.baseUrl}/health`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
