import { IsOptional } from 'class-validator';

export class FileUpload {
  @IsOptional()
  buffer: Buffer;

  @IsOptional()
  encoding?: string;

  @IsOptional()
  filename: string;

  @IsOptional()
  mimetype?: string;
}
