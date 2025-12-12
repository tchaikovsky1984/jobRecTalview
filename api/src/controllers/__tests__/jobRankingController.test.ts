import { describe, test, jest, expect, beforeEach } from "@jest/globals";

import { createMockRequest, createMockResponse, createMockNextFunction } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
});

const mockCRO = jest.fn();
const mockConnect = jest.fn();
const mockWorkflowStart = jest.fn();

jest.unstable_mockModule("../../config/graphqlClient.ts", () => ({
  gqlSdk: {
    CheckResumeOwnership: mockCRO
  }
}));

jest.unstable_mockModule("../../middleware/logger.ts", () => ({
  displayLog: jest.fn()
}));

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

describe("jobRankingController", () => {

  jest.unstable_mockModule("../../middleware/logger.ts", () => ({
    displayLog: jest.fn()
  }));

  // ==========================================================================

  test("no resume id", async () => {
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const { jobRankingController } = await import("../jobRankingController.ts");

    await jobRankingController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toBe("no resume specified");
    expect(mockCRO).not.toHaveBeenCalled();
  });

  test("no decoded jwt", async () => {
    const reqObj = {
      params: {
        id: 1
      }
    };
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { jobRankingController } = await import("../jobRankingController.ts");

    await jobRankingController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(403);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toBe("decoded jwt not provided");
    expect(mockCRO).not.toHaveBeenCalled();
  });

  // ==========================================================================

  test("no ownership", async () => {
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
    const { jobRankingController } = await import("../jobRankingController.ts");

    mockCRO.mockImplementationOnce((object) => {
      return { resume: [] };
    });

    await jobRankingController(mockReq, mockRes);

    expect(mockCRO).toHaveBeenCalledTimes(1);
    expect(mockCRO).toHaveBeenCalledWith({ id: 1, user_id: 1 });
    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toBe("no such resume exists");
  });

  // ==========================================================================

  test("workflow starts", async () => {
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
    const { jobRankingController } = await import("../jobRankingController.ts");
    const { Connection, Client } = await import("@temporalio/client");

    mockCRO.mockImplementationOnce((object) => {
      return { resume: ["resume"] };
    });

    mockConnect.mockImplementationOnce((object) => {
      return {};
    })

    mockWorkflowStart.mockImplementation((workflowtype, object) => {
      return { handleId: 1 };
    });

    await jobRankingController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(200);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toBe("Ranking started successfully");
    expect(mockCRO).toHaveBeenCalledTimes(1);
    expect(mockCRO).toHaveBeenCalledWith({ id: 1, user_id: 1 });
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledWith(
      "RankingWorkflow",
      {
        args: [
          { resume_id: 1, user_id: 1 }
        ],
        taskQueue: 'ranking-queue',
        workflowId: expect.stringContaining("workflow-ranking")
      }
    );

  });

  // ==========================================================================

  test("workflow doesnt start: temporal connection issue", async () => {
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
    const { jobRankingController } = await import("../jobRankingController.ts");
    const { Connection, Client } = await import("@temporalio/client");

    mockCRO.mockImplementationOnce((object) => {
      return { resume: ["resume"] };
    });

    mockConnect.mockImplementationOnce((object) => {
      return {};
    })

    mockWorkflowStart.mockImplementation((workflowtype, object) => {
      throw new Error();
    });

    await jobRankingController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("message");
    expect((mockRes as any).message).toBe("Failed to start workflow");
    expect(mockCRO).toHaveBeenCalledTimes(1);
    expect(mockCRO).toHaveBeenCalledWith({ id: 1, user_id: 1 });
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledWith(
      "RankingWorkflow",
      {
        args: [
          { resume_id: 1, user_id: 1 }
        ],
        taskQueue: 'ranking-queue',
        workflowId: expect.stringContaining("workflow-ranking")
      }
    );

  });



});
