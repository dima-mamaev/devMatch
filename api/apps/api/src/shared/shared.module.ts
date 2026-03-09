import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Auth0Service } from './services/auth0.service';
import { RoleGuard } from './guards/role.guard';
import { UserContextInterceptor } from './interceptors/user-context.interceptor';
import { ShouldExistValidator } from './validators/should-exist-validator';
import { ShouldBeEqualValidator } from './validators/should-be-equal-validator';
import { CloudinaryService } from './services/cloudinary.service';
import { MediaModule } from '../media/media.module';
import { CustomUploadModule } from '../custom-upload/custom-upload.module';
import { UniqueValidator } from './validators/unique-validator';
import { IsEntityCreatorValidator } from './validators/is-entity-creator-validator';
import { QueuesModule } from '../queues/queues.module';
import { SystemGuard } from './guards/system.guard';
import { TransactionService } from './services/transaction.service';
import { DeveloperModule } from '../developer/developer.module';
import { RecruiterModule } from '../recruiter/recruiter.module';
import { ShortlistModule } from '../shortlist/shortlist.module';

const modules = [
  UserModule,
  MediaModule,
  CustomUploadModule,
  QueuesModule,
  DeveloperModule,
  RecruiterModule,
  ShortlistModule,
];

const services = [Auth0Service, CloudinaryService, TransactionService];

const guards = [RoleGuard, SystemGuard];

const interceptors = [UserContextInterceptor];

const providers = [
  ShouldExistValidator,
  ShouldBeEqualValidator,
  UniqueValidator,
  IsEntityCreatorValidator,
];

@Global()
@Module({
  imports: [...modules],
  providers: [...guards, ...interceptors, ...providers, ...services],
  exports: [...modules, ...providers, ...services],
})
export class SharedModule { }
