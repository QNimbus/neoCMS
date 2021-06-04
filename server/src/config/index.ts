/**
 * Exports global types and constants that are used in the application.
 *
 * @module Configuration
 *
 */

/**
 * Container for all accepted environments
 */
let environments: Environments = {};

const currentEnvironment =
  typeof process.env.NODE_ENV == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

/**
 * Configuration defaults
 */
const environmentDefaults: Omit<EnvironmentConfig, 'envName' | 'corsOrigin'> = {
  port: 3000,
  passwordHashSalt: 10,
  jwtConfig: {
    accessTokenLifetime: '15 minutes',
    accessTokenCookie: 'access-token',
    accessTokenSecret:
      typeof process.env.ACCESS_TOKEN_SECRET == 'string'
        ? process.env.ACCESS_TOKEN_SECRET
        : 'mEbwgX0zsGFIRxlK3tnfKB7FpG2qKzj7QXaSaBKN',
    refreshTokenLifetime: '7 days',
    refreshTokenCookie: 'refresh-token',
    refreshTokenCookiePath: '/',
    refreshTokenSecret:
      typeof process.env.REFRESH_TOKEN_SECRET == 'string'
        ? process.env.REFRESH_TOKEN_SECRET
        : '1f5XF068OM5KltuLvvQmXjgsqjEUCI4zSn9Ramum',
  },
  redisConfig: { host: 'redis', port: 6379 } as RedisConfig,
  ormConfig: {
    name: 'default',
    type: 'mysql',
    host: 'db',
    port: 3306,
    username: 'neocms',
    password: 'neocms',
    database: 'neocms',
    entities: ['./src/data/entities/**/*.ts'],
    synchronize: true,
    entityPrefix: 'neo_',
    logging: false,
    dropSchema: false,
  } as OrmConfig,
};

/**
 * Development environment
 */
environments.development = {
  ...environmentDefaults,

  port: 3000,
  envName: 'development',
  corsOrigin: 'http://localhost:3000',
  ormConfig: {
    ...environmentDefaults.ormConfig,
    dropSchema: false,
    logging: true,
  },
};

/**
 * Staging environment
 */
environments.staging = {
  ...environmentDefaults,

  port: 4000,
  envName: 'staging',
  corsOrigin: 'http://localhost:4000',
  ormConfig: {
    ...environmentDefaults.ormConfig,
    entities: ['./src/data/entities/**/*.ts'],
  },
};

/**
 * Testing environment
 */
environments.testing = {
  ...environmentDefaults,

  port: 4000,
  envName: 'testing',
  corsOrigin: 'http://localhost:4000',
  ormConfig: {
    ...environmentDefaults.ormConfig,
    entities: ['./src/data/entities/**/*.ts', './dist/data/entities/**/*.js'],
  },
};

/**
 * Production environment
 */
environments.production = {
  ...environmentDefaults,

  port: 5000,
  envName: 'production',
  corsOrigin: 'http://myapp.com:5000',
  redisConfig: { host: '127.0.0.1', port: 6379 },
  jwtConfig: {
    ...environmentDefaults.jwtConfig,
    refreshTokenCookiePath: 'api/refresh_token',
  },
  ormConfig: {
    ...environmentDefaults.ormConfig,
    entities: ['./dist/data/entities/**/*.js'],
  },
};

/**
 * Named exports for config/index.ts.
 *
 * @remarks
 * Holds the config for the current environment (i.e. 'production', 'staging', et cetera)
 */
export const config =
  typeof environments[currentEnvironment] == 'object'
    ? environments[currentEnvironment]
    : environments.development;

export default config;
