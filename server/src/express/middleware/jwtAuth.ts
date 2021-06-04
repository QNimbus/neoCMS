/**
 *
 * Authentication middleware
 *
 */

// Dependencies
import jwt from 'jsonwebtoken';

import config from '../../config';

export const jwtAuth = async (
  req: express.Request,
  _: express.Response,
  next: () => void
) => {
  let [, accessToken] = (req.header('authorization') || '').split(' ');

  if (!accessToken) {
    // Continue with next middleware
    return next();
  }

  let userId: number;

  try {
    ({ userId } = jwt.verify(
      accessToken,
      config.jwtConfig.accessTokenSecret,
      {}
    ) as AccessToken);

    req.user = { id: userId };
  } catch {
  } finally {
    // Continue with next middleware
    return next();
  }
};
