import type { UUID } from 'crypto';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicEntity } from './basic.entity.js';
import type { Developer } from './developer.entity.js';

@Entity()
export class Project extends BasicEntity {
  declare readonly id: UUID;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('text', { array: true, default: '{}' })
  techStack: string[];

  @Column({ nullable: true })
  url?: string;

  @ManyToOne('Developer', 'projects', {
    onDelete: 'CASCADE',
  })
  developer: Developer;
}
