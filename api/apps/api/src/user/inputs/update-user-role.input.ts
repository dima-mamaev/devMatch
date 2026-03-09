import { Field, InputType, ID } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, Validate } from 'class-validator';
import type { UUID } from 'crypto';
import { UserService } from '../user.service';
import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { NotActiveUserValidator } from '../validators/not-active-user-validator';
import { UserRole } from '../../shared/enums/user-role.enum';

@InputType()
export class UpdateUserRoleInput {
  @Field(() => ID)
  @IsNotEmpty()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({ service: UserService }),
  )
  @Validate(NotActiveUserValidator)
  readonly id: UUID;

  @Field(() => UserRole)
  @IsNotEmpty()
  @IsIn([UserRole.Developer, UserRole.Recruiter, UserRole.Admin])
  readonly role: UserRole;
}
