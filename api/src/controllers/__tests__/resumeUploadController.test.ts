import { jest, describe, test, expect } from "@jest/globals";

import { createMockRequest, createMockResponse } from "../__mocks__/factories.ts";
import { error } from "console";

const mockIR = jest.fn();

jest.unstable_mockModule("../../config/graphqlClient.ts", () => ({
  gqlSdk: {
    InsertResume: mockIR
  }
}));

describe("resumeUploadController: Input Validation", () => {
  test.each([
    { rebObj: { file: null, user: { sub: 1 } }, desc: "no file", mess: "no file provided." },
    { rebObj: { file: 1, user: { sub: null } }, desc: "no user", mess: "user not provided" },
  ])("$desc", async ({ rebObj, mess }) => {
    const mockReq = createMockRequest(rebObj);
    const mockRes = createMockResponse();
    const { resumeUploadController } = await import("../resumeUploadController.ts");

    await resumeUploadController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(400);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: mess
    });
  })
});

describe("resumeUploadController", () => {

  test("could not insert properly", async () => {
    const rebObj = {
      file: 1,
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(rebObj);
    const mockRes = createMockResponse();
    const { resumeUploadController } = await import("../resumeUploadController.ts");

    mockIR.mockImplementationOnce(() => {
      return {
        insert_resume_one: {
          id: null
        }
      }
    });

    await resumeUploadController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toStrictEqual({
      message: "could not upload resume"
    });
  });

  test("could not insert improperly", async () => {
    const rebObj = {
      file: 1,
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(rebObj);
    const mockRes = createMockResponse();
    const { resumeUploadController } = await import("../resumeUploadController.ts");
    const errormsg = 'errormessage';

    mockIR.mockImplementationOnce(() => {
      throw new Error(errormsg);
    });

    await resumeUploadController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(500);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toEqual({
      message: "error",
      detail: errormsg
    });
  });

  test("inserted", async () => {
    const rebObj = {
      file: 1,
      user: {
        sub: 1
      }
    }
    const mockReq = createMockRequest(rebObj);
    const mockRes = createMockResponse();
    const { resumeUploadController } = await import("../resumeUploadController.ts");

    mockIR.mockImplementationOnce(() => {
      return {
        insert_resume_one: {
          id: 1
        }
      };
    });

    await resumeUploadController(mockReq, mockRes);

    expect(mockRes).toHaveProperty("statusCode");
    expect((mockRes as any).statusCode).toBe(200);
    expect(mockRes).toHaveProperty("body");
    expect((mockRes as any).body).toEqual({
      message: "resume uploaded",
      resumeId: 1
    });
  });

});
