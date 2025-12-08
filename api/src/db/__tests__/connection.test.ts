import { beforeEach, describe, expect, test, jest } from '@jest/globals';

import { DatabaseConfig } from '../../config/types.ts';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

// mocking pg so we dont goof the db 
jest.mock("pg", () => {

  const returnclient = {
    connect: jest.fn(),
    query: jest.fn(),
  };

  return { Client: jest.fn(() => returnclient) };
});

jest.mock("../../middleware/LoggingRequests.ts");
import { displayLog } from '../../middleware/LoggingRequests.ts';

const dummyDB: DatabaseConfig = {
  PG_URL: "localhost",
  PG_PORT: 5432,
  PG_NAME: "postgres",
  PG_USER: "postgres",
  PG_SECRET: "postgrespassword",
};

describe("connectDB", () => {

  test("returns client on success", async () => {
    const { connectDB } = await import('../connection.ts');

    const db_client = await connectDB(dummyDB);

    expect(db_client).toBeDefined();
    expect(db_client).toBeTruthy();
    expect(db_client).toHaveProperty("connect");
    expect(db_client).toHaveProperty("query");
    expect(displayLog).not.toHaveBeenCalled();
  });

  test("returns null on client.connect() fails with Aggregate Error", async () => {
    const { Client } = await import("pg");
    const { connectDB } = await import("../connection.ts");

    const conError = jest.fn().mockRejectedValueOnce(
      new AggregateError([new Error("Internal error 1")]) as never);

    (Client as unknown as jest.Mock).mockImplementationOnce(() => ({
      connect: conError
    }))

    const result = await connectDB(dummyDB);

    expect(result).toBeFalsy();
    expect(result).toBeNull();
    expect(displayLog).toHaveBeenCalled();
  });

  test("returns null on client.connect() fails with Error", async () => {
    const { Client } = await import("pg");
    const { connectDB } = await import("../connection.ts");

    const conError = jest.fn().mockRejectedValueOnce(new Error("Error1") as never);

    (Client as unknown as jest.Mock).mockImplementationOnce(() => ({
      connect: conError
    }))

    const result = await connectDB(dummyDB);

    expect(result).toBeFalsy();
    expect(result).toBeNull();
    expect(displayLog).toHaveBeenCalled();
  });


});
