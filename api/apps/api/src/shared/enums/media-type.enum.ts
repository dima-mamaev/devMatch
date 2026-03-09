import { registerEnumType } from '@nestjs/graphql';

export enum MediaType {
  Image = 'Image',
  Video = 'Video',
}

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Type of media',
});
