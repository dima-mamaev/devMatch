import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UserStatus } from '../../shared/enums/user-status.enum';

@Entity()
@Index(['auth0Id'], { unique: true, where: '"deletedAt" IS NULL' })
@ObjectType({ description: 'User' })
export class User extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  declare createdAt: Date;

  @Column()
  auth0Id: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field(() => UserRole)
  @Column('enum', {
    enum: UserRole,
    default: UserRole.Developer,
  })
  @Index()
  role: UserRole;

  @Field(() => UserStatus)
  @Column('enum', {
    enum: UserStatus,
    default: UserStatus.Active,
  })
  @Index()
  status: UserStatus;
}
