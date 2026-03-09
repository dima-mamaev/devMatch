import { IsOptional } from 'class-validator';

export class CustomUpload {
  @IsOptional()
  buffer: Buffer;

  @IsOptional()
  encoding?: string;

  @IsOptional()
  filename: string;

  @IsOptional()
  mimetype?: string;
}
