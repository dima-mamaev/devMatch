import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIAgentController } from './ai-agent.controller.js';
import { OpenAIAgentService } from './openai/openai-agent.service.js';
import { ToolHandlers } from './openai/tools/tool-handlers.js';
import { EventPublisherService } from './events/event-publisher.service.js';
import { Developer } from '../../../libs/shared/src/entities/developer.entity.js';
import { Experience } from '../../../libs/shared/src/entities/experience.entity.js';
import { Project } from '../../../libs/shared/src/entities/project.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get('POSTGRES_DB', 'devmatch'),
        entities: [Developer, Experience, Project],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Developer, Experience, Project]),
  ],
  controllers: [AIAgentController],
  providers: [OpenAIAgentService, ToolHandlers, EventPublisherService],
})
export class AIAgentModule {}
