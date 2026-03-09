import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';
import { UserService } from '../user.service';
import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import type { UUID } from 'crypto';
import { NotActiveUserValidator } from '../validators/not-active-user-validator';

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({ service: UserService }),
  )
  @Validate(NotActiveUserValidator)
  readonly id: UUID;
}
