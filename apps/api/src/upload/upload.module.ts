import { Module } from '@nestjs/common';
import { UploadScalar } from './scalars/upload.scalar';

@Module({
  providers: [UploadScalar],
})
export class UploadModule {}
