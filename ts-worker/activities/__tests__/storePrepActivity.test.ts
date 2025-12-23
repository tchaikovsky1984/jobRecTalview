import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { StoringPrepInput } from "../config/types";

const mockUpsert = jest.fn();
jest.mock("../../config/graphqlClient", () => ({
  gqlSdk: {
    UpsertPrepForRec: mockUpsert
  }
}));

const mockToPgArray = jest.fn();
jest.mock("../storeRankingActivity", () => ({
  toPgArray: mockToPgArray
}));

describe("storePrepActivity", () => {
  let consoleSpy: any;

  const mockInput: StoringPrepInput = {
    recommendation_id: 55,
    prep: {
      questions: [{ question: "Q1", answer: "A1", topic: "T1" }],
      tips: ["Tip A", "Tip B"],
      topics: ["Topic X"]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    mockToPgArray.mockImplementation((arr) => `{${arr.length}_ITEMS}`);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("Happy Path: Successfully stores and returns ID", async () => {
    const { storePrepActivity } = require("../storePrepActivity.ts");

    mockUpsert.mockResolvedValue({
      insert_interview_prep_one: { id: 999 }
    } as never);

    const result = await storePrepActivity(mockInput);

    expect(result).toBe(999);

    expect(mockToPgArray).toHaveBeenCalledTimes(2); // Once for tips, once for topics

    expect(mockUpsert).toHaveBeenCalledWith({
      rec_id: 55,
      questions: mockInput.prep.questions, // Passed raw
      tips: "{2_ITEMS}",
      topics: "{1_ITEMS}"
    });
  });

  test("Database Failure: Throws if ID is missing in response", async () => {
    const { storePrepActivity } = require("../storePrepActivity.ts");

    mockUpsert.mockResolvedValue({
      insert_interview_prep_one: null
    } as never);

    await expect(storePrepActivity(mockInput))
      .rejects
      .toThrow("Could not store");
  });

  test("Network Error: Rethrows exceptions from SDK", async () => {
    const { storePrepActivity } = require("../storePrepActivity.ts");

    const dbError = new Error("Postgres Connection Failed");
    mockUpsert.mockRejectedValue(dbError as never);

    await expect(storePrepActivity(mockInput))
      .rejects
      .toThrow("Postgres Connection Failed");

    expect(consoleSpy).toHaveBeenCalledWith(dbError);
  });
});
