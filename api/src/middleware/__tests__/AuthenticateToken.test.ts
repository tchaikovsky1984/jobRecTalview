import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import { createMockRequest, createMockNextFunction, createMockResponse } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
})

const mockVerify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockVerify
  }
}));

jest.unstable_mockModule("../../config/config.ts", () => ({
  JWT_SECRET: "mockJWT"
}));

describe("authenticateToken", () => {

  test("well formed jwt", async () => {
    const { authenticateToken } = await import("../AuthenticateToken.ts");
    const { default: jwt } = await import("jsonwebtoken");
    const reqObj = {
      headers: {
        authorization: "Bearer JWT"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNextFunction = createMockNextFunction();
    const payload = { sub: "14", iat: Math.floor(Date.now() / 1000) };

    mockVerify.mockImplementationOnce((token, JWT_SECRET, callback: any) => {
      callback(null, payload);
    });

    authenticateToken(mockReq, mockRes, mockNextFunction);

    expect(mockVerify).toHaveBeenCalledTimes(1);
    expect(mockVerify).toHaveBeenCalledWith(expect.stringContaining("JWT"), expect.stringContaining("mockJWT"), expect.any(Function));
    expect(mockReq).toHaveProperty("user");
    expect((mockReq as any).user).toHaveProperty("iat");
    expect((mockReq as any).user).toHaveProperty("sub");
    expect(mockNextFunction).toHaveBeenCalled();
  });

  test("no auth header", async () => {
    const { authenticateToken } = await import("../AuthenticateToken.ts");
    const { default: jwt } = await import("jsonwebtoken");
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const mockNextFunction = createMockNextFunction();
    const payload = { sub: "14", iat: Math.floor(Date.now() / 1000) };

    authenticateToken(mockReq, mockRes, mockNextFunction);

    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(401);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toMatch("authorization header not provided");
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  test("malformed bearer in auth header", async () => {
    const { authenticateToken } = await import("../AuthenticateToken.ts");
    const { default: jwt } = await import("jsonwebtoken");
    const reqObj = {
      headers: {
        authorization: "notBearer JWT" // "JWT"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNextFunction = createMockNextFunction();
    const payload = { sub: "14", iat: Math.floor(Date.now() / 1000) };

    authenticateToken(mockReq, mockRes, mockNextFunction);

    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toMatch("malformed JWT (no bearer)");
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  test("no jwt in auth header", async () => {
    const { authenticateToken } = await import("../AuthenticateToken.ts");
    const { default: jwt } = await import("jsonwebtoken");
    const reqObj = {
      headers: {
        authorization: "Bearer" // "JWT"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNextFunction = createMockNextFunction();
    const payload = { sub: "14", iat: Math.floor(Date.now() / 1000) };

    authenticateToken(mockReq, mockRes, mockNextFunction);

    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(401);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toMatch("authorization token not provided");
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  test("invalid token", async () => {
    const { authenticateToken } = await import("../AuthenticateToken.ts");
    const { default: jwt } = await import("jsonwebtoken");
    const reqObj = {
      headers: {
        authorization: "Bearer JWT"
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNextFunction = createMockNextFunction();
    const payload = { sub: "14", iat: Math.floor(Date.now() / 1000) };

    mockVerify.mockImplementationOnce((token, JWT_SECRET, callback: any) => {
      callback(new Error(), payload);
    });

    authenticateToken(mockReq, mockRes, mockNextFunction);

    expect(mockVerify).toHaveBeenCalledTimes(1);
    expect(mockVerify).toHaveBeenCalledWith("JWT", "mockJWT", expect.any(Function));
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(403);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toMatch("verification failed.");
    expect(mockNextFunction).not.toHaveBeenCalled();
  });


});
