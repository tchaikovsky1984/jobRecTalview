export type LogType = "LOG" | "ERR" | "WAR";

export type DatabaseConfig = {
  PG_URL: string;
  PG_PORT: number;
  PG_NAME: string;
  PG_USER: string;
  PG_SECRET: string;
};

export type RegisterRequestBody = {
  username: string;
  email: string;
  name: string;
  password: string;
};

export type LoginRequestBody = {
  username: string;
  password: string,
};

export type LoginResponseBody = {
  access_token: string;
  user_id: string;
  message: string;
}
