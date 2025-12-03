import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "../config/config";
import { LLMInput, LLMOutputSingleton } from "../config/types";
import { LLMOutput } from "../config/types.ts";

const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function llmRankingActivity(llmInput: LLMInput): Promise<LLMOutput> {
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

  let llmAccumulated: LLMOutputSingleton[] = [];

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
      const llmResponse = await genai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      const rawText = llmResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleanText = rawText.replace(/```json|```/g, "").trim();
      // 5. FIX: Type as Array[], not Singleton
      const llmResult: LLMOutputSingleton[] = JSON.parse(cleanText);

      if (Array.isArray(llmResult)) {
        llmAccumulated = llmAccumulated.concat(llmResult);
      }

    }

    catch (e) {
      console.log(e);
      console.log("failed on try " + i);
      throw e;
    }

  }

  if (!llmAccumulated) {
    throw new Error("LLM did not return a resposne" + "\n");
  }

  return { llmOuput: llmAccumulated, resume: llmInput.resume };
}
