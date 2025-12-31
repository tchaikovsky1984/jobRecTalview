import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql.ts';

const endpoint = process.env.HASURA_GRAPHQL_URL ? process.env.HASURA_GRAPHQL_URL : 'http://172.17.0.1:8080/v1/graphql';
const secret = process.env.HASURA_ADMIN_SECRET || '';
console.log(endpoint);
console.log(secret);

const client = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': secret,
  },
});

export const gqlSdk = getSdk(client);
