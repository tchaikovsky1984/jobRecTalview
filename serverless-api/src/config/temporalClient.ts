import { Connection, Client } from "@temporalio/client";

const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || '172.17.0.1:7233';

let cachedClient: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
  if (cachedClient) {
    return cachedClient;
  }
  const connection = await Connection.connect({ address: TEMPORAL_ADDRESS });
  return new Client({ connection });
}
