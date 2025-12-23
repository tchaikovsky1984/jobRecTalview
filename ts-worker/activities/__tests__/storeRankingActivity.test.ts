import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("Activity: storeRankingActivity", () => {
  let mockBulkInsert: any;
  let storeRankingActivity: any; // We will load this dynamically
  let toPgArray: any;            // We will load this dynamically

  beforeEach(() => {
    jest.resetModules();

    mockBulkInsert = jest.fn();

    jest.doMock("../../config/graphqlClient.ts", () => ({
      gqlSdk: {
        BulkInsertRecommendation: mockBulkInsert
      }
    }));

    const module = require("../storeRankingActivity.ts");
    storeRankingActivity = module.storeRankingActivity;
    toPgArray = module.toPgArray;
  });

  test("returns empty PG array for null/undefined/empty input", () => {
    expect(toPgArray(undefined)).toBe("{}");
    expect(toPgArray([])).toBe("{}");
  });

  test("Happy Path: Transforms payload and inserts successfully", async () => {
    mockBulkInsert.mockResolvedValue({
      insert_recommendation: { affected_rows: 2 }
    });

    const mockInput = {
      llmOuput: [{ job_id: 101, score: 85, reasoning: "Fit", matching_skills: ["A"], missing_skills: ["B"] }],
      resume: { resume_id: 55, user_id: 1 }
    };

    const result = await storeRankingActivity(mockInput);

    expect(result).toBe(true);
    expect(mockBulkInsert).toHaveBeenCalled();
  });

});
