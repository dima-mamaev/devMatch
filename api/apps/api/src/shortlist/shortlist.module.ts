import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shortlist } from './models/shortlist.entity';
import { ShortlistService } from './shortlist.service';
import { ShortlistResolver } from './shortlist.resolver';
import { DeveloperModule } from '../developer/developer.module';
import { Developer } from '../developer/models/developer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shortlist, Developer]),
    forwardRef(() => DeveloperModule),
  ],
  providers: [ShortlistService, ShortlistResolver],
  exports: [ShortlistService],
})
export class ShortlistModule {}
