import { beforeEach, describe, expect, test, jest } from '@jest/globals';

import { DatabaseConfig } from '../../config/types.ts';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

jest.unstable_mockModule("../../middleware/LoggingRequests.ts", () => ({
  displayLog: jest.fn()
}));
// mocking pg so we dont goof the db 
jest.unstable_mockModule("pg", () => {

  const returnclient = {
    connect: jest.fn(),
    query: jest.fn(),
  };

  return { Client: jest.fn(() => returnclient) };
});


const dummyDB: DatabaseConfig = {
  PG_URL: "localhost",
  PG_PORT: 5432,
  PG_NAME: "postgres",
  PG_USER: "postgres",
  PG_SECRET: "postgrespassword",
};

describe("connectDB tests", () => {

  test("returns client on success", async () => {
    const { displayLog } = await import('../../middleware/LoggingRequests.ts');
    const { connectDB } = await import('../connection.ts');

    const db_client = await connectDB(dummyDB);

    expect(db_client).toBeDefined();
    expect(db_client).toBeTruthy();
    expect(db_client).toHaveProperty("connect");
    expect(db_client).toHaveProperty("query");
    expect(displayLog).not.toHaveBeenCalled();
  });

  test("returns null on client.connect() fails with Aggregate Error", async () => {
    const { displayLog } = await import('../../middleware/LoggingRequests.ts');
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
    expect(displayLog as ReturnType<typeof jest.spyOn>).toHaveBeenCalled();
  });

  test("returns null on client.connect() fails with Error", async () => {
    const { displayLog } = await import('../../middleware/LoggingRequests.ts');
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

const error: Error = new Error();
error.name = "TESTERROR1"
error.message = "TESTERROR1"

describe("handleDatabaseError tests", () => {

  test("testing error handling", async () => {
    const { displayLog } = await import("../../middleware/LoggingRequests.ts");
    const { handleDatabaseError } = await import("../connection.ts");

    handleDatabaseError(error);
    expect(displayLog).toHaveBeenCalled();
    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(error.name + " : " + error.message, 'ERR');
  });

});

describe("getDBClient tests", () => {

  test("client does not exist", async () => {
    const { getDBClient } = await import("../connection.ts");
    const { Client } = await import("pg");

    const result = getDBClient();

    expect(result).toBeDefined();
    expect(result).not.toBeInstanceOf(Client);
    expect(result).toHaveProperty(["name"]);
    expect(result).toHaveProperty(["message"]);
    expect((result as Error).name).toMatch("Error");
    expect((result as Error).message).toMatch("Client does not exist yet. DB Connection not made.")
  });

  test("client exists", async () => {
    const { connectDB } = await import("../connection.ts");
    const { getDBClient } = await import("../connection.ts");

    const db_client = await connectDB(dummyDB);
    const client = getDBClient();

    expect(client).toBeDefined();
    expect(client).toStrictEqual(db_client);
  });

});
