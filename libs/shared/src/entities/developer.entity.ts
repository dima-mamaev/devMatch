import type { UUID } from 'crypto';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BasicEntity } from './basic.entity.js';
import { AvailabilityStatus } from '../enums/availability-status.enum.js';
import { SeniorityLevel } from '../enums/seniority-level.enum.js';
import type { Experience } from './experience.entity.js';
import type { Project } from './project.entity.js';

@Entity()
export class Developer extends BasicEntity {
  declare readonly id: UUID;

  declare createdAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({
    type: 'enum',
    enum: SeniorityLevel,
    nullable: true,
  })
  seniorityLevel?: SeniorityLevel;

  @Column('text', { array: true, default: '{}' })
  techStack: string[];

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  personalSiteUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    nullable: true,
  })
  @Index()
  availabilityStatus?: AvailabilityStatus;

  @Column({ default: false })
  onboardingCompleted: boolean;

  @OneToMany('Experience', 'developer')
  experiences: Experience[];

  @OneToMany('Project', 'developer')
  projects: Project[];
}
