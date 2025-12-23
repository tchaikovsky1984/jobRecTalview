import { jest, describe, test, expect } from "@jest/globals";

import { createMockRequest, createMockResponse } from "../__mocks__/factories.ts";
import { create } from "domain";

const mockHash = jest.fn();
const mockCUAE = jest.fn();
const mockCU = jest.fn();

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: mockHash
  }
}));

jest.unstable_mockModule("../../config/graphqlClient.ts", () => ({
  gqlSdk: {
    CheckUserAlreadyExists: mockCUAE,
    CreateUser: mockCU
  }
}));


describe("registrationController", () => {

  mockHash.mockImplementation((password) => {
    return password;
  });

  test("no userame", async () => {
    const reqObj = {
      body: {
        password: "abcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("username not provided");
  });

  test("no password", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("password not provided");
  });

  test("no email", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        password: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("email not provided");
  });

  test("no name", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        email: "example@example.com",
        password: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("name not provided");
  });

  test("empty name", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        email: "example@example.com",
        password: "Sample",
        name: ""
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("name not provided");
  });

  test("empty email", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        email: "",
        password: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("email not provided");
  });

  test("empty password", async () => {
    const reqObj = {
      body: {
        username: "abcd",
        email: "example@example.com",
        password: "",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("password not provided");
  });

  test("empty userame", async () => {
    const reqObj = {
      body: {
        username: "",
        password: "abcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("username not provided");
  });

  test("invalid email", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcd",
        email: "exampleexample.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toBe("invalid email");
  });

  test("invalid password (too short)", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toMatch("invalid password (at least 8 chars)");
  });

  test("invalid password (too long)", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcdabcdabcdabcdabcdabcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("error");
    expect((mockRes as any).body.error).toMatch("invalid password (at most 20 chars)");
  });

  test("user exists", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "cdabcdabcdabcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    mockCUAE.mockImplementationOnce((obj) => {
      return {
        user: [
          1
        ]
      };
    });

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "user exists with username or email"
    });
  });

  test("db error", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "cdabcdabcdabcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    mockCUAE.mockImplementationOnce((obj) => {
      return {
        user: [
        ]
      };
    });

    mockCU.mockImplementationOnce(() => {
      return {
        insert_user_one: {
          id: null
        }
      }
    });

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "could not be registered"
    });
  });

  test("registered", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "cdabcdabcdabcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    mockCUAE.mockImplementationOnce((obj) => {
      return {
        user: [
        ]
      };
    });

    mockCU.mockImplementationOnce(() => {
      return {
        insert_user_one: {
          id: 1
        }
      }
    });

    await registrationController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(200);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "Registration successful",
      userId: 1
    });
  });

  test("database throws critical error", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "cdabcdabcdabcd",
        email: "example@example.com",
        name: "Sample"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { registrationController } = await import("../registrationController.ts");

    mockCUAE.mockRejectedValue(new Error("Connection Timeout") as never);

    await registrationController(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(500);
    expect((mockRes as any).body.error).toBeDefined();
  });

});
