/**
 * @module utils
 */

// Dependencies
import ms from 'ms';

// Local dependencies
import config from '../config';

export const sendRefreshToken = (res: express.Response, token: string) => {
  res.cookie(config.jwtConfig.refreshTokenCookie, token, {
    expires: new Date(Date.now() + ms(config.jwtConfig.refreshTokenLifetime)),
    secure: config.envName !== 'development',
    sameSite: true,
    httpOnly: true,
    path: config.jwtConfig.refreshTokenCookiePath,
  });
};
