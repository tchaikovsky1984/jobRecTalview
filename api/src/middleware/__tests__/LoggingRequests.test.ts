import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import EventEmitter from "events";

import { createMockRequest, createMockNextFunction } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

jest.unstable_mockModule("../logger.ts", () => ({
  displayLog: jest.fn()
}));

describe("handleLogging", () => {

  test("checking a well formed req", async () => {
    const { default: handleLogging } = await import("../LoggingRequests.ts");
    const { displayLog } = await import("../logger.ts");
    const reqObj = { method: "GET", url: "localhost:7171/user/register", socket: { remotAddress: "localhost" } };
    const mockReq = createMockRequest(reqObj)
    const mockRes = new EventEmitter() as any;
    mockRes.statusCode = 200;
    const mockNext = createMockNextFunction();

    handleLogging(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(
      expect.stringContaining("Incoming"),
      "LOG"
    );

    mockRes.emit("finish");

    expect(displayLog).toHaveBeenCalledTimes(2);
    expect(displayLog).toHaveBeenCalledWith(
      expect.stringContaining("Outgoing"),
      "LOG"
    );

  });

  test("handling req with a masked socketAddress", async () => {
    const { default: handleLogging } = await import("../LoggingRequests.ts");
    const { displayLog } = await import("../logger.ts");

    const reqObj = { method: "GET", url: "localhost:7171/user/register" };
    const mockReq = createMockRequest(reqObj)
    const mockRes = new EventEmitter() as any;
    mockRes.statusCode = 200;
    const mockNext = createMockNextFunction();

    handleLogging(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(displayLog).toHaveBeenCalledTimes(1);
    expect(displayLog).toHaveBeenCalledWith(
      expect.stringContaining("Incoming"),
      "LOG"
    );

    mockRes.emit("finish");

    expect(displayLog).toHaveBeenCalledTimes(2);
    expect(displayLog).toHaveBeenCalledWith(
      expect.stringContaining("Outgoing"),
      "LOG"
    );

  });

});
