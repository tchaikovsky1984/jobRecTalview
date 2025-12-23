import { afterEach, jest, describe, test, expect, beforeEach } from "@jest/globals";
import { InterviewPrepWorkflowInput } from "../../config/types";

afterEach(() => {
  jest.resetModules();
});

const mockSRWI = jest.fn();
const mockSJBI = jest.fn();
const mockSRSS = jest.fn();

describe("getRecommendationActivity", () => {

  let consoleSpy;

  const recommendationId: InterviewPrepWorkflowInput = {
    recId: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });
  });

  test("invalid recommedation id", async () => {

    jest.doMock("../../config/graphqlClient", () => ({
      __esModule: true,
      gqlSdk: {
        SelectRecommendationWithId: mockSRWI
      }
    }));

    const { getRecommendationActivity } = require("../getRecommendationActivity.ts");

    mockSRWI.mockImplementationOnce(() => {
      return {
        recommendation: []
      }
    });

    await expect(getRecommendationActivity(recommendationId)).rejects.toThrow("No such recommendation");

    expect(mockSRWI).toHaveBeenCalledTimes(1);
  });

  test("invalid job or resume id", async () => {

    jest.doMock("../../config/graphqlClient", () => ({
      __esModule: true,
      gqlSdk: {
        SelectRecommendationWithId: mockSRWI,
        SelectJobById: mockSJBI,
        SelectResumeSkillSum: mockSRSS
      }
    }));

    const { getRecommendationActivity } = require("../getRecommendationActivity.ts");

    mockSRWI.mockImplementationOnce(() => {
      return {
        recommendation: [1]
      }
    });
    mockSJBI.mockImplementationOnce(() => {
      return {
        job: []
      }
    });
    mockSRSS.mockImplementationOnce(() => {
      return {
        resume: []
      }
    });

    await expect(getRecommendationActivity(recommendationId)).rejects.toThrow("No such resume or job");

    expect(mockSRWI).toHaveBeenCalledTimes(1);
  });


});
