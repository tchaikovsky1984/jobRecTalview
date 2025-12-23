import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "../config/config";
import { LLMJobInput, LLMJobOutputSingleton } from "../config/types";
import { LLMJobOutput } from "../config/types.ts";

const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function llmRankingActivity(llmInput: LLMJobInput): Promise<LLMJobOutput> {
  const batchLimit = 10;
  const jobs = llmInput.job.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    matching_skills: job.matching_skills,
    missing_skills: job.missing_skills,
    location: job.location,
    is_remote: job.search_pref_area === 'Remote'
  }));
  const batchedJobs = [];
  for (let i = 0; i < jobs.length; i += batchLimit) {
    batchedJobs.push(jobs.slice(i, i + batchLimit));
  }

  let llmAccumulated: LLMJobOutputSingleton[] = [];

  for (let i = 0; i < batchedJobs.length; i++) {

    const jobs = batchedJobs[i];
    const jobsBatchJson = JSON.stringify(jobs);
    if (!jobs) {
      break;
    }

    const prompt = `
    You are a Senior Technical Recruiter. 
    
    ### TASK
    Evaluate the suitability of the following ${jobs.length} Job Descriptions against the Candidate Profile.
    
    ### CANDIDATE PROFILE
    - **Target Role:** ${llmInput.resume.title || "Not Specified"}
    - **Preferred Location:** ${llmInput.resume.location || "Not Specified"}
    - **Professional Summary:** "${llmInput.summary || "No summary provided."}"

    ### SCORING CRITERIA (0-100)
    1. **Skill Match (45pts):** High score if 'matching_skills' > 'missing_skills'. Penalize heavily if critical hard skills for the role are in 'missing_skills'.
    2. **Role Relevance (30pts):** Does the Job Title and seniority level align with the Candidate's summary?
    3. **Location/Logistics (25pts):** Penalize if job is onsite in a different city than preferred. Reward if location matches or is Remote.

    ### INPUT DATA (JSON)
    ${jobsBatchJson}

    ### OUTPUT REQUIREMENTS
    Return a raw JSON Array of objects. Do not include markdown formatting (no \`\`\`json).
    Schema per object:
    {
      "job_id": Number, // strictly match input ID
      "score": Number,  // 0-100
      "reasoning": String // Max 5 sentence. Be blunt. E.g. "Perfect skill match but wrong location."
    }
  `;

    try {
      if (i > 0) {
        console.log("Throttling for 4 seconds to respect API limits...");
        await new Promise(resolve => setTimeout(resolve, 4100));
      }

      const llmResponse = await genai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const rawText = llmResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanText = rawText.replace(/```json|```/g, "").trim();
      const llmRawResult = JSON.parse(cleanText);
      console.log("batch length: " + llmRawResult.length);

      if (Array.isArray(llmRawResult)) {
        const mergedResult: LLMJobOutputSingleton[] = llmRawResult.map((scoredJob: any) => {
          const originalJobData = jobs.find(j => j.id === scoredJob.job_id);
          return {
            job_id: scoredJob.job_id,
            score: scoredJob.score,
            reasoning: scoredJob.reasoning,
            matching_skills: originalJobData?.matching_skills || [],
            missing_skills: originalJobData?.missing_skills || []
          };
        });
        llmAccumulated = llmAccumulated.concat(mergedResult);
        console.log("accumulated length: " + llmAccumulated.length);
      }

    }

    catch (e) {
      console.log(e);
      console.log("failed on try " + i);
      throw e;
    }

  }

  if (llmAccumulated.length === 0) {
    throw new Error("LLM did not return a resposne" + "\n");
  }

  return { llmOuput: llmAccumulated, resume: llmInput.resume };
}
