import { Field, InputType, ID } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, Validate } from 'class-validator';
import type { UUID } from 'crypto';
import { UserService } from '../user.service';
import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { UserStatus } from '../../shared/enums/user-status.enum';
import { NotActiveUserValidator } from '../validators/not-active-user-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({ service: UserService }),
  )
  @Validate(NotActiveUserValidator)
  readonly id: UUID;

  @Field(() => UserStatus)
  @IsNotEmpty()
  @IsIn([UserStatus.Active, UserStatus.Suspended])
  readonly status: UserStatus;
}
