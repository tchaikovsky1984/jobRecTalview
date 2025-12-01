import { Client } from 'pg';

import type { DatabaseConfig } from "./types.ts";

let persistentClient: Client;

export async function connectDB(info: DatabaseConfig): Promise<Client | null> {
  try {
    const client = new Client({
      user: info.PG_USER,
      password: info.PG_SECRET,
      host: info.PG_URL,
      port: info.PG_PORT,
      database: info.PG_NAME
    });

    await client.connect();

    persistentClient = client;

    return client;
  }
  catch (err: any) {
    if (err instanceof AggregateError) {
      console.log("Database connection failed due to multiple errors:", "ERR");
      // Loop through all internal errors and log their messages
      err.errors.forEach((e: Error, index: number) => {
        console.log(`[Internal Error ${index + 1}]: ${e.message}`, "ERR");
      });
    }
    else {
      console.log(`Database connection failed: ${err.message}`, "ERR");
    }
    return null;
  }
}
export function getDBClient(): Client | Error {
  return persistentClient ? persistentClient : new Error("Client does not exist yet. DB Connection not made.");
}
