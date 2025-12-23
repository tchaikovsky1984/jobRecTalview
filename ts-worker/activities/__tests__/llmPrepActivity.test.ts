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

jest.mock("../../config/config.ts", () => ({
  GEMINI_API_KEY: "mock-api-key"
}));

describe("llmPrepActivity", () => {
  let consoleSpy: any;

  const mockRecommendation = {
    job: {
      title: "Dev",
      company: "Corp",
      description: "Do coding."
    },
    resume: {
      summary: "I code good."
    },
    skill_matches: ["Typescript"],
    skill_misses: ["Java"],
    reasoning: "Good fit"
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

  test("parses valid json response", async () => {
    const { llmPrepActivity } = require("../llmPrepActivity.ts");

    const mockOutput = {
      questions: [{ question: "Q1?", topic: "React" }],
      topics: ["Hooks"],
      tips: ["Be confident"]
    };

    mockGenerateContent.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              { text: JSON.stringify(mockOutput) }
            ]
          }
        }
      ]
    } as never);

    // 4. Start the promise (it will hang on the setTimeout)
    const promise = llmPrepActivity(mockRecommendation);

    // 5. Fast-forward time by 4 seconds
    jest.advanceTimersByTime(4000);

    // 6. Await the result
    const result = await promise;

    expect(result).toEqual(mockOutput);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents).toContain("You are a Senior Technical Interviewer");
    expect(callArgs.contents).toContain("Do coding."); // Job desc
  });

  test("handles json markdown formatting", async () => {
    const { llmPrepActivity } = require("../llmPrepActivity.ts");

    const mockOutput = { topics: ["Clean Code"] };

    // Gemini often wraps output in ```json ... ```
    const markdownText = "```json\n" + JSON.stringify(mockOutput) + "\n```";

    mockGenerateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: markdownText }] } }]
    });

    const promise = llmPrepActivity(mockRecommendation);
    jest.advanceTimersByTime(4000);
    const result = await promise;

    expect(result).toEqual(mockOutput);
  });

  test("throws on invalid json (hallucination)", async () => {
    const { llmPrepActivity } = require("../llmPrepActivity.ts");

    // LLM returns plain text instead of JSON
    mockGenerateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: "I cannot answer this." }] } }]
    });

    const promise = llmPrepActivity(mockRecommendation);
    jest.advanceTimersByTime(4000);

    // Expect the JSON.parse error to bubble up
    await expect(promise).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalled(); // Ensure error was logged
  });

  test("throws on api network error", async () => {
    const { llmPrepActivity } = require("../llmPrepActivity.ts");

    mockGenerateContent.mockRejectedValue(new Error("Google 500 Error"));

    const promise = llmPrepActivity(mockRecommendation);
    jest.advanceTimersByTime(4000);

    await expect(promise).rejects.toThrow("Google 500 Error");
    expect(consoleSpy).toHaveBeenCalled();
  });
});
