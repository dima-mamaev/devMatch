import { registerEnumType } from '@nestjs/graphql';

export enum MediaProcessingStatus {
  Processing = 'Processing',
  Ready = 'Ready',
  Failed = 'Failed',
}

registerEnumType(MediaProcessingStatus, {
  name: 'MediaProcessingStatus',
  description: 'Media processing status',
});
