declare interface IApiContext {
  req: express.Request;
  res: express.Response;
}

declare type AccessToken = { userId: number };

declare type RefreshToken = { userId: number; tokenVersion: number };
