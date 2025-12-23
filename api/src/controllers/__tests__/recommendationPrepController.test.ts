import { jest, describe, test, expect, beforeEach } from "@jest/globals"

import { createMockRequest, createMockResponse } from "../__mocks__/factories.ts";

beforeEach(() => {
  jest.clearAllMocks();
});

const mockDL = jest.fn();
const mockConnect = jest.fn();
const mockWorkflowStart = jest.fn();
const mockCREO = jest.fn();

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
    CheckRecommendationOwnershipAndExistence: mockCREO
  }
}));

jest.unstable_mockModule("../../middleware/logger.ts", () => ({
  displayLog: mockDL
}));

describe("recommendationPrepController", () => {

  test("no rec id", async () => {
    const reqObj = {
      params: {
        id: null
      },
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");

    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "recommendation not provided"
    });
  });

  test("no user id", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: null
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");

    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "user not provided"
    });
  });

  test("no such recommendation", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");

    mockCREO.mockImplementationOnce((obj) => {
      return {
        recommendation: [
        ]
      };
    });

    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "recommendation does not exist"
    });
  });

  test("workflow doesnt start properly", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");
    const { Connection, Client } = await import("@temporalio/client");

    mockCREO.mockImplementationOnce((obj) => {
      return {
        recommendation: [
          1
        ]
      };
    });

    mockConnect.mockImplementationOnce((object) => {
      return {};
    })

    mockWorkflowStart.mockImplementation((workflowtype, object) => {
      throw new Error();
    });

    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "workflow could not be started"
    });
    expect(mockCREO).toHaveBeenCalledTimes(1);
    expect(mockCREO).toHaveBeenCalledWith({ rec_id: 1, user_id: 1 });
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledWith(
      "interviewPrepWorkflow",
      {
        args: [
          { recId: 1 }
        ],
        taskQueue: 'ranking-queue',
        workflowId: expect.stringContaining("workflow-ranking")
      }
    );
  });

  test("workflow doesnt start improperly", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    mockCREO.mockImplementationOnce((obj) => {
      return {
        recommendation: [
          1
        ]
      };
    });

    mockConnect.mockImplementationOnce((object) => {
      throw new Error();
    })


    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "workflow could not be started"
    });
    expect(displayLog).toHaveBeenCalled();
    expect(mockCREO).toHaveBeenCalledTimes(1);
    expect(mockCREO).toHaveBeenCalledWith({ rec_id: 1, user_id: 1 });
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledTimes(0);
  });

  test("workflow starts", async () => {
    const reqObj = {
      params: {
        id: 1
      },
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(reqObj);
    const mockRes = createMockResponse();
    const { recommendationPrepController } = await import("../recommendationPrepController.ts");
    const { displayLog } = await import("../../middleware/logger.ts");

    mockCREO.mockImplementationOnce((obj) => {
      return {
        recommendation: [
          1
        ]
      };
    });

    mockConnect.mockImplementationOnce((object) => {
      return {};
    })


    await recommendationPrepController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "workflow could not be started"
    });
    expect(displayLog).toHaveBeenCalled();
    expect(mockCREO).toHaveBeenCalledTimes(1);
    expect(mockCREO).toHaveBeenCalledWith({ rec_id: 1, user_id: 1 });
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockWorkflowStart).toHaveBeenCalledTimes(1);
  });


});
