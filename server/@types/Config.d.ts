declare type RedisConfig = {
  host: string;
  port: number;
};

/**
 * Specifies the type of a generated token (i.e. to reset a users password or to confirm email address for a new user)
 */
declare const enum TokenUrlType {
  RESET_PASSWORD,
  CONFIRM_EMAIL,
}

declare type JWTConfig = {
  accessTokenLifetime: string;
  accessTokenCookie: string;
  accessTokenSecret: string;
  refreshTokenLifetime: string;
  refreshTokenCookie: string;
  refreshTokenCookiePath: string;
  refreshTokenSecret: string;
};

declare type OrmConfig = ConnectionOptions;

declare type Environments = Record<string, EnvironmentConfig>;

declare type EnvironmentConfig = {
  port: number;
  envName: string;
  corsOrigin: string;
  passwordHashSalt: string | number;
  redisConfig: RedisConfig;
  jwtConfig: JWTConfig;
  ormConfig: OrmConfig;
};
