/**
 * @module Main
 *
 * @remark
 * Contains main function which is called at the end of the file.
 *
 */

// Dependencies
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { ApolloServer } from 'apollo-server-express';
import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';

// Local dependencies
import { config } from './config';
import { UserResolver } from './data/resolvers/user/UserResolver';
import { jwtAuth } from './express/middleware/jwtAuth';
import loadRouters from './express/router/routers';

// Local constants

const apiBase = '/api';

const main = async () => {
  // Read connection options from ormconfig file (or ENV variables) and customize
  let connectionOptions: ConnectionOptions;

  try {
    connectionOptions = await getConnectionOptions();
  } catch (e) {
    connectionOptions = {} as ConnectionOptions;
  }

  Object.assign(connectionOptions, { ...config.ormConfig });

  // Create a connection using modified connection options
  await createConnection(connectionOptions);
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            /**
             * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
            const complexity = getComplexity({
              // Our built schema
              schema,
              // To calculate query complexity properly,
              // we have to check only the requested operation
              // not the whole document that may contains multiple operations
              operationName: request.operationName,
              // The GraphQL query document
              query: document,
              // The variables for our GraphQL query
              variables: request.variables,
              // Add any number of estimators. The estimators are invoked in order, the first
              // numeric value that is being returned by an estimator is used as the field complexity.
              // If no estimator returns a value, an exception is raised.
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                fieldExtensionsEstimator(),
                // Add more estimators here...
                // This will assign each field a complexity of 1
                // if no other estimator returned a value.
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            // Here we can react to the calculated complexity,
            // like compare it with max and throw error when the threshold is reached.
            if (complexity > 20) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
              );
            }
            // And here we can e.g. subtract the complexity point from hourly API calls limit.
            console.log('Used query complexity points:', complexity);
          },
        }),
      },
    ],
    context: ({ req, res }): IApiContext => ({ req, res }),
  });

  // Initialize Express app & middleware
  const app = Express();

  // Disable Express 'X-powered-by' header
  app.set('x-powered-by', false);

  // Use cookie-parser middleware to store cookie on request object
  app.use(cookieParser());

  // Middleware to get user.id from access-token
  app.use(jwtAuth);

  // Load all Express routers & routes
  loadRouters(app);

  // Apollo server CORS options => https://github.com/expressjs/cors#configuration-options
  apolloServer.applyMiddleware({
    path: `${apiBase}/graphql`,
    app,
    cors: {
      credentials: true,
      origin: config.corsOrigin,
    },
  });

  app.listen(config.port, () => {
    console.log(
      `Server started on http://localhost:${config.port}${apiBase}/graphql`
    );
  });
};

main();
