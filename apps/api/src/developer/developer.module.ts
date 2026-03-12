import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './models/developer.entity';
import { Experience } from './models/experience.entity';
import { Project } from './models/project.entity';
import { DeveloperService } from './developer.service';
import { DeveloperQueryResolver } from './developer.query.resolver';
import { DeveloperMutationResolver } from './developer.mutation.resolver';
import { UserModule } from '../user/user.module';
import { MediaModule } from '../media/media.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Developer, Experience, Project]),
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
    forwardRef(() => QueuesModule),
  ],
  providers: [
    DeveloperService,
    DeveloperQueryResolver,
    DeveloperMutationResolver,
  ],
  exports: [DeveloperService],
})
export class DeveloperModule {}
