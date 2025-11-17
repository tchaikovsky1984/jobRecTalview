import { Client } from 'pg';
import { GraphQLClient } from 'graphql-request';

import type { DatabaseConfig } from "../config/types.ts";

let persistentClient: Client;

export async function connectDB(info: DatabaseConfig): Promise<Client | null> {
  try {
    console.log("connecting with:", info);
    const client = new Client({
      user: info.DB_USR,
      password: info.DB_PWD,
      host: info.DB_HOSTNAME,
      port: info.DB_PORT,
      database: info.DB_NAME
    });

    await client.connect();

    persistentClient = client;

    return client;
  }
  catch (err: any) {
    return null;
  }
}

export function handleDatabaseError(err: Error): void {
  console.log('===================================');
  console.log("RAW ERROR: " + err);
  console.log("err: " + err.name);
  console.log(err.message);
  console.log('===================================');
}

export function getDBClient(): Client | Error {
  return persistentClient ? persistentClient : new Error("Client does not exist yet. DB Connection not made.");
}

export const persistentGraphQLClient: GraphQLClient = new GraphQLClient("http://localhost:8080/v1/graphql",
  {
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
  });
