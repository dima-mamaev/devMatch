import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { User } from '../../user/models/user.entity';
import { Developer } from '../../developer/models/developer.entity';

@Entity()
@ObjectType({ description: 'Shortlist entry' })
@Unique(['user', 'developer']) // Prevent duplicate entries
export class Shortlist extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  declare createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Index()
  user: User;

  @Field(() => Developer)
  @ManyToOne(() => Developer, { onDelete: 'CASCADE' })
  @JoinColumn()
  developer: Developer;
}
