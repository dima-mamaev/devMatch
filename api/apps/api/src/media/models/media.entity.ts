import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { MediaType } from '../../shared/enums/media-type.enum';
import { MediaProcessingStatus } from '../../shared/enums/media-processing-status.enum';

@Entity()
@ObjectType({ description: 'Media' })
export class Media extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field(() => MediaType)
  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => MediaProcessingStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: MediaProcessingStatus,
    nullable: true,
  })
  processingStatus?: MediaProcessingStatus;
}
