import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }))
  };
});

jest.mock("../../config/config", () => ({
  GEMINI_API_KEY: "mock-key"
}));

describe("llmRankingActivity", () => {
  let consoleSpy: any;

  const createMockJobs = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Job ${i + 1}`,
      company: "Tech Corp",
      description: "Desc",
      matching_skills: ["Skill A"],
      missing_skills: ["Skill B"],
      location: "Remote",
      search_pref_area: "Remote"
    }));
  };

  const mockResume = {
    title: "Dev",
    location: "Remote",
    skills: ["Skill A"]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.useFakeTimers();

    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleSpy.mockRestore();
  });

  test("Single Batch: Processes < 10 jobs without throttling", async () => {
    const { llmRankingActivity } = require("../llmRankingActivity.ts");

    const inputJobs = createMockJobs(5); // 5 Jobs
    const llmInput = { job: inputJobs, resume: mockResume, summary: "Summary" };

    const mockLLMResponse = inputJobs.map(j => ({
      job_id: j.id,
      score: 85,
      reasoning: "Good match"
    }));

    mockGenerateContent.mockResolvedValueOnce({
      candidates: [{ content: { parts: [{ text: JSON.stringify(mockLLMResponse) }] } }]
    } as never);

    const result = await llmRankingActivity(llmInput);

    expect(result.llmOuput).toHaveLength(5);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1); // Only 1 call
    expect(result.llmOuput[0].matching_skills).toEqual(["Skill A"]); // Data Merging worked
  });

  test("Multi-Batch: Processes 12 jobs (10 + 2) with throttling", async () => {
    const { llmRankingActivity } = require("../llmRankingActivity.ts");

    const inputJobs = createMockJobs(12); // 12 Jobs = 2 Batches
    const llmInput = { job: inputJobs, resume: mockResume, summary: "Summary" };

    const batch1Response = inputJobs.slice(0, 10).map(j => ({
      job_id: j.id, score: 90, reasoning: "Batch 1"
    }));

    const batch2Response = inputJobs.slice(10, 12).map(j => ({
      job_id: j.id, score: 90, reasoning: "Batch 2"
    }));

    mockGenerateContent
      .mockResolvedValueOnce({
        candidates: [{ content: { parts: [{ text: JSON.stringify(batch1Response) }] } }]
      } as never)
      .mockResolvedValueOnce({
        candidates: [{ content: { parts: [{ text: JSON.stringify(batch2Response) }] } }]
      } as never);

    const promise = llmRankingActivity(llmInput);

    await jest.advanceTimersByTimeAsync(5000);

    const result = await promise;

    expect(result.llmOuput).toHaveLength(12);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);

    expect(result.llmOuput[0].job_id).toBe(1);
    expect(result.llmOuput[11].job_id).toBe(12);
  });

  test("Data Merging: Handles missing skills in input gracefully", async () => {
    const { llmRankingActivity } = require("../llmRankingActivity.ts");

    const inputJobs = [{
      id: 99,
      title: "Dev",
      matching_skills: undefined,
      missing_skills: null,
      search_pref_area: "Remote"
    }];

    const llmInput = { job: inputJobs, resume: mockResume, summary: "Summary" };

    mockGenerateContent.mockResolvedValueOnce({
      candidates: [{ content: { parts: [{ text: JSON.stringify([{ job_id: 99, score: 50, reasoning: "Ok" }]) }] } }]
    } as never);

    const result = await llmRankingActivity(llmInput);

    expect(result.llmOuput[0].matching_skills).toEqual([]);
    expect(result.llmOuput[0].missing_skills).toEqual([]);
  });

  test("Error Handling: Throws if API fails on any batch", async () => {
    const { llmRankingActivity } = require("../llmRankingActivity.ts");
    const inputJobs = createMockJobs(5);
    const llmInput = { job: inputJobs, resume: mockResume, summary: "Summary" };

    mockGenerateContent.mockRejectedValue(new Error("API Quota Exceeded") as never);

    await expect(llmRankingActivity(llmInput)).rejects.toThrow("API Quota Exceeded");
  });

  test("Output Validation: Throws if LLM returns non-array (Hallucination)", async () => {
    const { llmRankingActivity } = require("../llmRankingActivity.ts");
    const inputJobs = createMockJobs(5);
    // @ts-ignore
    const llmInput = { job: inputJobs, resume: mockResume, summary: "Summary" };

    // Scenario: LLM returns a single object { "error": ... } instead of an Array [...]
    // This causes the 'Array.isArray' check in your code to fail, leaving llmAccumulated empty.
    mockGenerateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: JSON.stringify({ error: "Not an array" }) }] } }]
    } as never);

    // Since llmAccumulated.length is 0, your new check should throw.
    await expect(llmRankingActivity(llmInput))
      .rejects
      .toThrow("LLM did not return a resposne");
  });

});
