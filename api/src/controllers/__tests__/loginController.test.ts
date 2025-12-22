import { beforeEach, jest, describe, test, expect } from "@jest/globals";

import { createMockNextFunction, createMockRequest, createMockResponse } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
});

const mockSUAP = jest.fn();
const mockBCompare = jest.fn();
const mockJSign = jest.fn();

jest.unstable_mockModule("../../config/graphqlClient.ts", () => ({
  gqlSdk: {
    SelectUserAndPassword: mockSUAP
  }
}));

jest.unstable_mockModule("../../middleware/logger.ts", () => ({
  displayLog: jest.fn()
}));

jest.unstable_mockModule("../../config/config.ts", () => ({
  JWT_SECRET: "mockJWT"
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: mockBCompare
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: mockJSign
  }
}));

describe("loginController", () => {

  test("no object sent", async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    await loginController(mockReq, mockRes);

    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(expect.stringContaining("Error"), "ERR");
    expect(mockRes).toHaveProperty("statusCode");
    expect(mockRes.statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.access_token).toBe("");
    expect((mockRes as any).body.user_id).toBe("");
    expect(mockBCompare).not.toHaveBeenCalled();
  });

  test("no username", async () => {
    const reqObj = {
      body: {
        password: "abcde"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    await loginController(mockReq, mockRes);

    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(expect.stringContaining("Error"), "ERR");
    expect(mockRes).toHaveProperty("statusCode");
    expect(mockRes.statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.access_token).toBe("");
    expect((mockRes as any).body.user_id).toBe("");
    expect(mockBCompare).not.toHaveBeenCalled();
  });

  test("no password", async () => {
    const reqObj = {
      body: {
        username: "abcde"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    await loginController(mockReq, mockRes);

    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(expect.stringContaining("Error"), "ERR");
    expect(mockRes).toHaveProperty("statusCode");
    expect(mockRes.statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.access_token).toBe("");
    expect((mockRes as any).body.user_id).toBe("");
    expect(mockBCompare).not.toHaveBeenCalled();
  });

  test("malformed user returned from DB", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcde"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");

    mockSUAP.mockImplementationOnce((object) => {
      return {
        user: [
          {
            id: null,
            hashed_pwd: null,
            username: null
          }
        ]
      }
    });

    await loginController(mockReq, mockRes);

    expect(mockSUAP).toHaveBeenCalledTimes(1);
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.access_token).toBe("");
    expect((mockRes as any).body.user_id).toBe("");
    expect(mockBCompare).not.toHaveBeenCalled();
  });

  test("non matching password", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcde"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");

    mockSUAP.mockImplementationOnce((object) => {
      return {
        user: [
          {
            id: 1,
            password_hash: "hashed_pwd",
            username: "anshuldev"
          }
        ]
      }
    });

    mockBCompare.mockImplementationOnce((password, hashed_pwd) => {
      return false;
    })

    await loginController(mockReq, mockRes);

    expect(mockSUAP).toHaveBeenCalledTimes(1);
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.access_token).toBe("");
    expect((mockRes as any).body.user_id).toBe("");
    expect((mockRes as any).body.message).toBe("wrong password");
    expect(mockBCompare).toHaveBeenCalledTimes(1);
    expect(mockBCompare).toHaveBeenCalledWith(reqObj.body.password, "hashed_pwd")
  });

  test("successful login", async () => {
    const reqObj = {
      body: {
        username: "anshuldev",
        password: "abcde"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { loginController } = await import("../loginController.ts");

    mockSUAP.mockImplementationOnce((object) => {
      return {
        user: [
          {
            id: 1,
            password_hash: "hashed_pwd",
            username: "anshuldev"
          }
        ]
      }
    });

    mockBCompare.mockImplementationOnce((password, hashed_pwd) => {
      return true;
    })

    mockJSign.mockImplementationOnce((obj, mockJWT, obj2) => {
      return obj;
    });

    const HASURA_CLAIMS_NAMESPACE = "https://hasura.io/jwt/claims";

    const hasuraClaims = {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": "1", // The ID extracted from the DB
    };

    const payload = {
      [HASURA_CLAIMS_NAMESPACE]: hasuraClaims,
      "sub": "1",
      "iat": Math.floor(Date.now() / 1000), // Issued At (current timestamp)
    };

    await loginController(mockReq, mockRes);

    expect(mockSUAP).toHaveBeenCalledTimes(1);
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(200);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toHaveProperty("access_token");
    expect((mockRes as any).body).toHaveProperty("user_id");
    expect((mockRes as any).body).toHaveProperty("message");
    expect((mockRes as any).body.user_id).toBe("1");
    expect((mockRes as any).body.message).toBe("Login successful. Token generated.");
    expect(mockBCompare).toHaveBeenCalledTimes(1);
    expect(mockBCompare).toHaveBeenCalledWith(reqObj.body.password, "hashed_pwd")
    expect((mockRes as any).body.access_token).toEqual(payload);
  });

});
