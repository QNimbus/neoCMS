/**
 * @module resolvers/inputtypes
 */

// Dependencies
import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyRegistered } from '../../resolvers/validator/user/isEmailAlreadyRegistered';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyRegistered()
  email: string;

  @Field()
  password: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;
}
