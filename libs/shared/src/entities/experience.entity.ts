import type { UUID } from 'crypto';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicEntity } from './basic.entity.js';
import type { Developer } from './developer.entity.js';

@Entity()
export class Experience extends BasicEntity {
  declare readonly id: UUID;

  @Column()
  position: string;

  @Column()
  companyName: string;

  @Column()
  startYear: number;

  @Column({ nullable: true })
  endYear?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne('Developer', 'experiences', {
    onDelete: 'CASCADE',
  })
  developer: Developer;
}
