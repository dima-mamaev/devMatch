import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload-ts';
import { CustomUpload } from '../model/upload';
import { plainToClass } from 'class-transformer';
import { stream2buffer } from '../../shared/utils/stream2buffer';
import { ValueNode } from 'graphql/language/ast';

@Scalar('CustomUpload', () => CustomUpload)
@Injectable()
export class CustomUploadScalar implements CustomScalar<
  any,
  Promise<CustomUpload>
> {
  description = 'Custom upload scalar type';

  async parseValue(value: Upload) {
    await value.promise;
    if (!value.file) {
      return new CustomUpload();
    }
    const buffer = await stream2buffer(value.file.createReadStream());
    return plainToClass(CustomUpload, {
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
