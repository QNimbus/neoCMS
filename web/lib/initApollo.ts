// Dependencies
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Determine whether apolloClient is instantiated client- or server-side (browser or NodeJS)
const isBrowser: boolean = process.browser;

export interface ApolloClientOptions {
  getToken: () => string;
}

function create(initialState: any = {}, { getToken }: ApolloClientOptions) {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/api/graphql',
    credentials: 'same-origin',
  });

  /**
   * @remark The setContext function accepts a function that returns either an object or a promise, which then returns an object to set the new context of a request.
   * It receives two arguments: the GraphQL request being executed, and the previous context.
   * See [Apollo Context Link api doc](The setContext function accepts a function that returns either an object or a promise, which then returns an object to set the new context of a request. It receives two arguments: the GraphQL request being executed, and the previous context.)
   */
  const authLink = setContext((_req, { headers }) => {
    const token = getToken();

    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Locations: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache().restore(initialState),
  });
}

let apolloClient: ApolloClient<NormalizedCacheObject>;

export default function initApollo(
  initialState: any,
  apolloClientOptions: ApolloClientOptions
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, apolloClientOptions);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, apolloClientOptions);
  }

  return apolloClient;
}
