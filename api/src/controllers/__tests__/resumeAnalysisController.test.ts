import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { createMockNextFunction, createMockRequest, createMockResponse } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
});

const mockDL = jest.fn();
const mockConnect = jest.fn();
const mockWorkflowStart = jest.fn();
const mockCRO = jest.fn();

const createMockClient = jest.fn((object) => ({
  workflow: {
    start: mockWorkflowStart
  }
}));

jest.unstable_mockModule("@temporalio/client", () => ({
  Connection: {
    connect: mockConnect
  },
  Client: createMockClient
}));

jest.unstable_mockModule("../../config/graphqlClient.ts", () => ({
  gqlSdk: {
    CheckResumeOwnership: mockCRO
  }
}));

jest.unstable_mockModule("../../middleware/logger.ts", () => ({
  displayLog: mockDL
}));

describe("resumeAnalysisContoller: Input Validation", () => {

  test.each([
    { reqObj: { params: { id: null }, user: { sub: 1 } }, desc: "no resume id", mess: "resume not provided" },
    { reqObj: { params: { id: 1 }, user: { sub: null } }, desc: "no user id", mess: "user not provided" },
  ])("$desc", async ({ reqObj, mess }) => {
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");

    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: mess
    });
  });

});

describe("resumeAnalysisController", () => {

  test("no such resume", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");

    mockCRO.mockImplementationOnce((obj) => {
      return {
        resume: []
      }
    });

    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(402);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "resume does not exist"
    })
  });

  test("no filpath", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");

    mockCRO.mockImplementationOnce((obj) => {
      return {
        resume: [
          {
            filepath: null
          }
        ]
      }
    });

    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "filepath not available"
    })

  });

  test("workflow not started properly", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    mockCRO.mockImplementationOnce((obj) => {
      return {
        resume: [
          {
            filepath: "filepath"
          }
        ]
      }
    });

    mockConnect.mockImplementationOnce(() => { });

    mockWorkflowStart.mockImplementationOnce(() => {
      throw new Error("message1");
    });

    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(displayLog).toHaveBeenCalled();
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "Failed to start workflow"
    })

  });

  test("workflow not started improperly", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");

    mockCRO.mockImplementationOnce((obj) => {
      return {
        resume: [
          {
            filepath: "filepath"
          }
        ]
      }
    });

    mockConnect.mockImplementation((obj) => {
      throw new Error("message");
    });

    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "Failed to start workflow"
    })

  });

  test("controller error", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const mockNext = createMockNextFunction();
    const { resumeAnalysisController } = await import("../resumeAnalysisContoller.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    mockCRO.mockImplementationOnce((obj) => {
      throw new Error("message");
    });


    await resumeAnalysisController(mockReq, mockRes, mockNext);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(displayLog).toHaveBeenCalled();
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "Internal Server Error"
    })

  });

});

