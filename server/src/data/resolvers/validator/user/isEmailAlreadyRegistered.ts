/**
 * @module resolvers/validators
 */

// Export for typedoc
export { ValidationOptions } from 'class-validator';

// Dependencies
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Local dependencies
import { User } from '../../../entities/User';

@ValidatorConstraint({ async: true })
class isEmailAlreadyRegisteredConstraint
  implements ValidatorConstraintInterface
{
  async validate(email: string) {
    return User.findOne({ where: { email } }).then((user) => {
      if (user) return false;
      return true;
    });
  }

  defaultMessage(): string {
    return 'email is already in use';
  }
}

export function IsEmailAlreadyRegistered(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyRegisteredConstraint,
    });
  };
}
