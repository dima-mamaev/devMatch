import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { User } from '../../user/models/user.entity';
import { Media } from '../../media/models/media.entity';
import { AvailabilityStatus } from '../../shared/enums/availability-status.enum';
import { SeniorityLevel } from '../../shared/enums/seniority-level.enum';
import { Experience } from './experience.entity';
import { Project } from './project.entity';

@Entity()
@ObjectType({ description: 'Developer' })
export class Developer extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  declare createdAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  @Index({ unique: true })
  user: User;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  jobTitle?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => SeniorityLevel, { nullable: true })
  @Column({
    type: 'enum',
    enum: SeniorityLevel,
    nullable: true,
  })
  seniorityLevel?: SeniorityLevel;

  @Field(() => [String])
  @Column('text', { array: true, default: '{}' })
  techStack: string[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  githubUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  personalSiteUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Field(() => AvailabilityStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    nullable: true,
  })
  @Index()
  availabilityStatus?: AvailabilityStatus;

  @Field(() => Media, { nullable: true })
  @OneToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  profilePhoto?: Media;

  @Field(() => Media, { nullable: true })
  @OneToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  introVideo?: Media;

  @Field(() => Boolean)
  @Column({ default: false })
  onboardingCompleted: boolean;

  @Field(() => [Experience])
  @OneToMany(() => Experience, (experience) => experience.developer)
  experiences: Experience[];

  @Field(() => [Project])
  @OneToMany(() => Project, (project) => project.developer)
  projects: Project[];
}
