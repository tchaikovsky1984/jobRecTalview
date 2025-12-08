import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "../config/config.ts";
import { LLMPrepOutput, RecJob, Recommendation, RecResume } from "../config/types.ts";

const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function llmPrepActivity(recommendation: Recommendation): Promise<LLMPrepOutput> {
  const job: RecJob = recommendation.job;
  const resume: RecResume = recommendation.resume;

  const prompt = `
  You are a Senior Technical Interviewer and Career Coach. 
    Your goal is to prepare a candidate for a specific job interview by generating a targeted "Cheat Sheet."

  ### INPUT CONTEXT
  - **Role:** ${job.title} at ${job.company}
  - **Job Description:** "${job.description.slice(0, 3000)}" ... (truncated)
  - **Candidate Summary:** "${resume.summary}"
  - **Skill Matches:** ${JSON.stringify(recommendation.skill_matches)}
  - **Skill Misses:** ${JSON.stringify(recommendation.skill_misses)}
  - **Reasoning:** "${recommendation.reasoning}"

  ### INSTRUCTIONS
  Generate a JSON object containing 3 sections: questions, revision topics, and strategy tips.

    #### 1. QUESTIONS ARRAY
  Generate 5-8 technical questions in total.

    **A. Project Deep-Dives (First Priority):**
    - Analyze the "Candidate Summary" text to identify specific projects, apps, or complex features they built.
    - Ask challenging architectural or decision-based questions about them (e.g., "Why did you use this db?", "How did you handle auth?").
    - **CRITICAL:** For these questions, set the 'topic' field exactly as: "**Project: [Project Name] - [Tech Used]**".

    **B. Technical Validation:**
    - Ask nuance/seniority checks on their "Skill Matches" to verify depth.
    - Set 'topic' to the specific skill name (e.g., "React Hooks", "Python GIL").

    **C. Gap Defense:**
    - Ask conceptual questions about critical "Skill Misses".
    - Set 'topic' to the missing skill name.

    #### 2. TOPICS (Array of Strings)
  - List 3-5 high-priority concepts or technologies they must revise before this interview. 

    #### 3. TIPS (Array of Strings)
  - Provide 3 strategic tips based on the job description's culture or specific tech stack requirements.

    ### OUTPUT SCHEMA
  Strictly return a raw JSON object (no markdown).
    {
    "questions": [
      { 
        "question": "String", 
        "answer": "String (Short ideal answer)", 
        "topic": "String (e.g. 'Project: Dungeon Master Agent - LLM')" 
      }
    ],
    "topics": ["String", "String"],
    "tips": ["String", "String"]
  }
  `;

  // throttling req
  await new Promise(resolve => setTimeout(resolve, 4000));

  try {
    const llmRawResponse = await genai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = llmRawResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const llmRawResult = JSON.parse(cleanText);

    return llmRawResult;

  }
  catch (e) {
    console.log(e);
    throw e;
  }
}
