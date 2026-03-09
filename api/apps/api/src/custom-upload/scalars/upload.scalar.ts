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
    console.log('[CustomUploadScalar] parseValue called, value:', value);
    console.log('[CustomUploadScalar] value type:', typeof value);
    console.log('[CustomUploadScalar] value keys:', value ? Object.keys(value) : 'null');

    await value.promise; // needs to be awaited to resolve the promise
    console.log('[CustomUploadScalar] after promise, value.file:', value.file);

    if (!value.file) {
      console.log('[CustomUploadScalar] No file found, returning empty CustomUpload');
      return new CustomUpload();
    }

    console.log('[CustomUploadScalar] File found:', {
      filename: value.file.filename,
      mimetype: value.file.mimetype,
      encoding: value.file.encoding,
    });

    const buffer = await stream2buffer(value.file.createReadStream());
    console.log('[CustomUploadScalar] Buffer size:', buffer.length);

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
