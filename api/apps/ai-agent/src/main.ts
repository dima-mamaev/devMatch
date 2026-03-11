import { NestFactory } from '@nestjs/core';
import { AIAgentModule } from './ai-agent.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AIAgentModule);

  const port = process.env.AI_AGENT_PORT || 4001;
  await app.listen(port);

  console.log(`AI Agent Service running on port ${port}`);
}

bootstrap();
