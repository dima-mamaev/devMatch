import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Auth0Service } from './services/auth0.service';
import { RoleGuard } from './guards/role.guard';
import { UserContextInterceptor } from './interceptors/user-context.interceptor';
import { CloudinaryService } from './services/cloudinary.service';
import { MediaModule } from '../media/media.module';
import { UploadModule } from '../upload/upload.module';
import { QueuesModule } from '../queues/queues.module';
import { SystemGuard } from './guards/system.guard';
import { TransactionService } from './services/transaction.service';
import { DeveloperModule } from '../developer/developer.module';
import { RecruiterModule } from '../recruiter/recruiter.module';
import { ShortlistModule } from '../shortlist/shortlist.module';
import { AIMatchModule } from '../ai-match/ai-match.module';

const modules = [
  UserModule,
  MediaModule,
  UploadModule,
  QueuesModule,
  DeveloperModule,
  RecruiterModule,
  ShortlistModule,
  AIMatchModule,
];

const services = [Auth0Service, CloudinaryService, TransactionService];

const guards = [RoleGuard, SystemGuard];

const interceptors = [UserContextInterceptor];

@Global()
@Module({
  imports: [...modules],
  providers: [...guards, ...interceptors, ...services],
  exports: [...modules, ...services],
})
export class SharedModule {}
