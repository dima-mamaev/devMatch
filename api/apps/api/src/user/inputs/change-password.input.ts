import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { ShouldBeEqualValidator } from '../../shared/validators/should-be-equal-validator';
import { CouldChangePasswordValidator } from '../validators/could-change-password-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must include at least 1 lowercase, 1 uppercase, 1 number, and 1 special symbol (!@#$%^&*)',
    },
  )
  @Validate(CouldChangePasswordValidator)
  readonly password: string;

  @Field()
  @IsNotEmpty()
  @Validate(
    ShouldBeEqualValidator,
    ShouldBeEqualValidator.params({ relatedField: 'password' }),
  )
  readonly confirm: string;
}
