import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './models/recruiter.entity';
import { RecruiterService } from './recruiter.service';
import { RecruiterResolver } from './recruiter.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recruiter]),
    forwardRef(() => UserModule),
  ],
  providers: [RecruiterService, RecruiterResolver],
  exports: [RecruiterService],
})
export class RecruiterModule {}
