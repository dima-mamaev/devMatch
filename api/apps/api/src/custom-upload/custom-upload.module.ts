import { Module } from '@nestjs/common';
import { CustomUploadScalar } from './scalars/upload.scalar';
import { IsFileSize } from './validators/is-file-size-validator';
import { IsFileType } from './validators/is-file-type-validator';

@Module({
  providers: [CustomUploadScalar, IsFileType, IsFileSize],
})
export class CustomUploadModule {}
