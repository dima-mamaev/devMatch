import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { Developer } from './developer.entity';

@Entity()
@ObjectType({ description: 'Experience' })
export class Experience extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field(() => String)
  @Column()
  position: string;

  @Field(() => String)
  @Column()
  companyName: string;

  @Field(() => Int)
  @Column()
  startYear: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  endYear?: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Developer, (developer) => developer.experiences, {
    onDelete: 'CASCADE',
  })
  developer: Developer;
}
