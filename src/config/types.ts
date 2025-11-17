export type DatabaseConfig = {
  DB_HOSTNAME: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USR: string;
  DB_PWD: string;
};

export type RegisterRequestBody = {
  username: string;
  email: string;
  name: string;
  role: string;
  password: string,
};

export type Role = "admin" | "user";
