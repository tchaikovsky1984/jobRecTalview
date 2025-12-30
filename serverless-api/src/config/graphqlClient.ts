import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql.ts';

const endpoint = process.env.HASURA_GRAPHQL_URL ? process.env.HASURA_GRAPHQL_URL + "v1/graphql" : 'http://host.docker.internal:8080/v1/graphql';
const secret = process.env.HASURA_ADMIN_SECRET || '';

const client = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': secret,
  },
});

export const gqlSdk = getSdk(client);
