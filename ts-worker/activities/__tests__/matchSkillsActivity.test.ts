import { describe, test, expect } from "@jest/globals";
import { matchSkillsActivity } from "../matchSkillsActivity.ts";
import { matchSkillsInput } from "../../config/types.ts";

describe("matchSkillsActivity", () => {

  test("Happy Path: Correctly segregates matching and missing skills", async () => {
    const input: matchSkillsInput = {
      resume_skills: ["Python", "Docker", "AWS"],
      jobs: [
        {
          id: 1,
          title: "Backend Dev",
          company: "Tech Co",
          description: "...",
          location: "Remote",
          search_pref_area: "Remote",
          skills: ["Python", "Java", "Docker", "Kubernetes"]
        } as any
      ]
    };

    const result = await matchSkillsActivity(input);

    expect(result).toHaveLength(1);

    expect(result[0].matching_skills).toEqual(["python", "docker"]);

    expect(result[0].missing_skills).toEqual(["java", "kubernetes"]);
  });

  test("Case Insensitivity: Matches regardless of capitalization", async () => {
    const input: matchSkillsInput = {
      resume_skills: ["ReAcT", "nOdE.jS"],
      jobs: [
        {
          id: 1,
          skills: ["react", "Node.js", "Express"]
        } as any
      ]
    };

    const result = await matchSkillsActivity(input);

    // Should match both React and Node.js
    expect(result[0].matching_skills).toContain("react");
    expect(result[0].matching_skills).toContain("node.js");
    expect(result[0].missing_skills).toEqual(["express"]);
  });

  test("Edge Case: Job has no skills property (null/undefined)", async () => {
    const input: matchSkillsInput = {
      resume_skills: ["Java"],
      jobs: [
        {
          id: 1,
          title: "Manager",
          skills: null // Simulating DB returning null
        } as any,
        {
          id: 2,
          title: "Intern",
          // skills property completely missing
        } as any
      ]
    };

    const result = await matchSkillsActivity(input);

    expect(result).toHaveLength(2);

    // Both should default to empty arrays, not crash
    expect(result[0].matching_skills).toEqual([]);
    expect(result[0].missing_skills).toEqual([]);
    expect(result[1].matching_skills).toEqual([]);
    expect(result[1].missing_skills).toEqual([]);
  });

  test("Edge Case: Resume has no skills", async () => {
    const input: matchSkillsInput = {
      resume_skills: [],
      jobs: [
        {
          id: 1,
          skills: ["Python", "Java"]
        } as any
      ]
    };

    const result = await matchSkillsActivity(input);

    expect(result[0].matching_skills).toEqual([]);
    expect(result[0].missing_skills).toEqual(["python", "java"]);
  });

  test("Immutability: Returns cloned objects, does not mutate input", async () => {
    const jobObject = { id: 1, skills: ["Go"] };
    const input: matchSkillsInput = {
      resume_skills: ["Go"],
      jobs: [jobObject as any]
    };

    const result = await matchSkillsActivity(input);

    // 1. Verify functionality
    expect(result[0].matching_skills).toEqual(["go"]);

    // 2. Verify Immutability (Input should NOT have matching_skills property)
    expect(jobObject).not.toHaveProperty("matching_skills");

    // 3. Verify Reference Integrity (Result object is a clone, not the same reference)
    expect(result[0]).not.toBe(jobObject);
  });
});
