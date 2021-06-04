/**
 *
 * Authentication middleware
 *
 */

// Dependencies
import { UseMiddleware } from 'type-graphql';

export function IsLoggedIn(isLoggedIn: boolean = true) {
  return UseMiddleware(async ({ context: { req } }, next) => {
    if (!!req.user?.id !== isLoggedIn) {
      throw new Error(isLoggedIn ? 'Not authenticated' : 'Already logged in');
    }
    return next();
  });
}
