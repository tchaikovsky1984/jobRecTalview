import dotenv from "dotenv"

import type { DatabaseConfig } from "./types.ts";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5050;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const DB_HOSTNAME: string = process.env.DB_HOSTNAME || "localhost";
const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
const DB_USR: string = process.env.DB_USR || "postgresql";
const DB_PWD: string = process.env.DB_PWD || "password";
const DB_NAME: string = process.env.DB_NAME || "node_express_dev";


export const DEV = process.env.NODE_ENV === "dev";
export const TEST = process.env.NODE_ENV === "test";

export const SERVER = {
  HOSTNAME,
  PORT
};

export const DB: DatabaseConfig = {
  DB_HOSTNAME,
  DB_PORT,
  DB_NAME,
  DB_USR,
  DB_PWD
};
