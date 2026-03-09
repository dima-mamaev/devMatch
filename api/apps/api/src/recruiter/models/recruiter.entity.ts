import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { User } from '../../user/models/user.entity';

@Entity()
@ObjectType({ description: 'Recruiter' })
export class Recruiter extends BasicEntity {
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

  // Computed field - expose email from user
  @Field(() => String)
  get email(): string {
    return this.user?.email;
  }
}
