/**
 * @module utils
 */

// Dependencies
import ms from 'ms';
import { redisClient } from '../redis';
import { v4 as uuidv4 } from 'uuid';

export const createTokenUrl = async (
  userId: number,
  tokenUrlType: TokenUrlType,
  options: { expires?: number | string } = {}
): Promise<string> => {
  const token = uuidv4();
  const { expires } = options;

  // User default expire time of 10 minutes if not defined or unable to parse 'ms' string
  let _expires;
  if (typeof expires == 'string') {
    _expires = ms(expires);
  }
  await redisClient.set(
    `${tokenUrlType}_${token}`,
    userId,
    'ex',
    _expires ? _expires : ms('10 minutes')
  );

  // Build confirmation url
  switch (tokenUrlType) {
    case TokenUrlType.CONFIRM_EMAIL: {
      return `http://localhost:3000/user/confirm/${token}`;
    }
    case TokenUrlType.RESET_PASSWORD: {
      return `http://localhost:3000/user/change-password/${token}`;
    }
    default: {
      return '';
    }
  }
};
