import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserQueryResolver } from './user.query.resolver';
import { UserService } from './user.service';
import { UserMutationResolver } from './user.mutation.resolver';
import { UserResolver } from './user.resolver';
import { NotActiveUserValidator } from './validators/not-active-user-validator';
import { CouldChangePasswordValidator } from './validators/could-change-password-validator';
import { DeveloperModule } from '../developer/developer.module';
import { RecruiterModule } from '../recruiter/recruiter.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => DeveloperModule),
    forwardRef(() => RecruiterModule),
    forwardRef(() => MediaModule),
  ],
  providers: [
    UserService,
    UserQueryResolver,
    UserMutationResolver,
    UserResolver,
    CouldChangePasswordValidator,
    NotActiveUserValidator,
  ],
  exports: [UserService],
})
export class UserModule {}
