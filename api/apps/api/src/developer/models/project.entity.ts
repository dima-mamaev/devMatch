import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { Developer } from './developer.entity';

@Entity()
@ObjectType({ description: 'Project' })
export class Project extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => [String])
  @Column('text', { array: true, default: '{}' })
  techStack: string[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Developer, (developer) => developer.projects, {
    onDelete: 'CASCADE',
  })
  developer: Developer;
}
