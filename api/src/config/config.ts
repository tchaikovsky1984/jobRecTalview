import dotenv from "dotenv";
import path from "path";

const project_root_dir = path.join(import.meta.dirname, "../../../.env");
const result = dotenv.config({ path: project_root_dir });

if (result.error) {
  console.log(result.error);
  console.log(project_root_dir)
}

const HOSTNAME: string = process.env.HOSTNAME || "localhost";
const PORT: Number = Number(process.env.PORT) || 7171;

const HASURA_URL: string = process.env.HASURA_URL || "http://localhost:8080";
const HASURA_ADMIN_SECRET = process.env.HASURA_SECRET;
const PG_NAME = process.env.PG_NAME || "chat_app_db";
const PG_URL = process.env.PG_URL || "localhost";
const PG_USER = process.env.PG_USER || "chat_user";
const PG_SECRET = process.env.PG_SECRET || "changethispassword";
const PG_PORT = 5500;

export const SERVER = {
  HOSTNAME,
  PORT
};

export const HASURA = {
  HASURA_URL,
  HASURA_ADMIN_SECRET
};

export const PG = {
  PG_URL,
  PG_PORT,
  PG_NAME,
  PG_USER,
  PG_SECRET,
};

export const JWT_SECRET: string = process.env.JWT_SECRET || "wrong-key";
