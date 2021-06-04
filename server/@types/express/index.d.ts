import * as _express from 'express';

declare global {
  declare namespace express {
    interface Request extends _express.Request {
      user?: {
        id: number;
      };
    }

    interface Response extends _express.Response {
      cookie: (key: string, value: string, options?: CookieOptions) => void;
      clearCookie: (key: string) => void;
    }
  }
}
