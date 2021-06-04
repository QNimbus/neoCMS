/**
 * @module utils
 */

// Dependencies
import jwt from 'jsonwebtoken';

// Local dependencies
import { config } from '../config';
import { User } from '../data/entities/User';

/**
 * Generates an access-token and a refresh-token for the given user
 *
 *
 * @param user User for which tokens are requested
 * @returns Object with 'accessToken' and 'refreshToken' properties
 */
export const createTokens = (
  user: User
): Record<'accessToken' | 'refreshToken', string> => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return { accessToken, refreshToken };
};

/**
 * Generate a access-token for the given user
 *
 * @param user User for which the access-token is requested
 * @returns accessToken
 */
export const createAccessToken = (user: User): string => {
  const accessTokenData: AccessToken = { userId: user.id };
  return jwt.sign(accessTokenData, config.jwtConfig.accessTokenSecret, {
    expiresIn: config.jwtConfig.accessTokenLifetime,
  });
};

/**
 * Generate an refresh-token for the given user
 *
 * @param user User for which the refresh-token is requested
 * @returns refreshToken
 */
export const createRefreshToken = (user: User): string => {
  // Increment current refresh-token version
  const refreshTokenData: RefreshToken = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };
  return jwt.sign(refreshTokenData, config.jwtConfig.refreshTokenSecret, {
    expiresIn: config.jwtConfig.refreshTokenLifetime,
  });
};
