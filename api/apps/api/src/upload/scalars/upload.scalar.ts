import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload-ts';
import { FileUpload } from '../model/upload';
import { plainToClass } from 'class-transformer';
import { stream2buffer } from '../../shared/utils/stream2buffer';
import { ValueNode } from 'graphql/language/ast';

@Scalar('Upload', () => FileUpload)
@Injectable()
export class UploadScalar implements CustomScalar<
  any,
  Promise<FileUpload>
> {
  description = 'File upload scalar type';

  async parseValue(value: Upload) {
    await value.promise;
    if (!value.file) {
      return new FileUpload();
    }
    const buffer = await stream2buffer(value.file.createReadStream());
    return plainToClass(FileUpload, {
      filename: value.file.filename,
      mimetype: value.file.mimetype,
      encoding: value.file.encoding,
      buffer,
    });
  }

  serialize(value: unknown) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: ValueNode): any {
    return GraphQLUpload.parseLiteral(ast);
  }
}
