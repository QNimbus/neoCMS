// Dependencies
import Express from 'express';
import jwt from 'jsonwebtoken';

// Local dependencies
import config from '../../../config';
import { createTokens } from '../../../utils/createTokens';
import { User } from '../../../data/entities/User';
import { sendRefreshToken } from '../../../utils/sendRefreshToken';

// Express route to check server status
export default (router: Express.Router) => {
  // Express route to allow user to request a new accessToken
  router.post('/refresh_token', async (req, res) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    // Get refresh-token from incoming request (cookie)
    let refreshToken: string = req.cookies[config.jwtConfig.refreshTokenCookie];

    // If no refresh-token was provided, return HTTP 401
    if (!refreshToken) {
      return res.status(401).json({ ok: false, accessToken: '' });
    }

    // Validate JWT refresh-token and return HTTP 401 if invalid
    let tokenPayload: RefreshToken;
    try {
      tokenPayload = jwt.verify(
        refreshToken,
        config.jwtConfig.refreshTokenSecret
      ) as RefreshToken;
    } catch (err) {
      // TODO: Console log error
      return res.status(401).json({ ok: false, accessToken: '' });
    }

    // Fetch user by user.id as set in JWT refresh-token
    // Return HTTP 401 if no user found or tokenVersion was incorrect
    const user = await User.findOne(tokenPayload.userId);
    if (!user || user.tokenVersion !== tokenPayload.tokenVersion) {
      return res.status(401).json({ ok: false, accessToken: '' });
    }

    // Invalidate current refresh-token
    await user.invalidateRefreshToken();

    // Get new access- and refresh-tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      createTokens(user);

    // Set response cookie with new refresh-token
    sendRefreshToken(res, newRefreshToken);

    // Return JSON response with new access-token
    return res.status(200).json({ ok: true, accessToken: newAccessToken });
  });
};
