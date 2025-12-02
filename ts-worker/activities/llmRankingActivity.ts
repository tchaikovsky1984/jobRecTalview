import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "../config/config";
import { LLMInput } from "../config/types";

const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function llmRankingActivity(llmInput: LLMInput): Promise<void> {
  const jsonInput = JSON.stringify(llmInput, null, 2);
  const prompt = `
    You are an expert AI Technical Recruiter and Career Coach. Your task is to evaluate a list of job opportunities 
    against a candidate's profile and rank them by suitability.

    ### INPUT DATA CONTEXT
    You will be provided with a JSON object containing:
    1. "resume": Contains the candidate's preferred Job Title and Target Location.
    2. "job": An array of job listings. 
       - Crucially, this list includes pre-calculated data: "matching_skills" (skills the candidate has) and 
        "missing_skills" (skills the job requires but the candidate lacks).
       - It also contains location data (search_pref_area, search_pref_country) and experience levels.

    ### SCORING ALGORITHM (0-100)
    Assign a score based on the following weighted criteria:
    
    1. **Skill Fit (45 points):** - Analyze the ratio of 'matching_skills' to 'missing_skills'. 
       - If 'missing_skills' contains critical hard skills for the specific 'title', penalize heavily. 
       - If 'missing_skills' are generic or soft skills, penalize lightly.
    
    2. **Role Relevance (30 points):**
       - Compare the candidate's preferred 'title' (from resume) with the job 'title'. 
       - Look for semantic similarity (e.g., "Frontend Dev" matches "React Engineer").
    
    3. **Location Fit (25 points):**
       - Compare 'resume.location' with 'job.search_pref_area' or 'job.search_pref_country'.
       - Full points for exact location match.
       - Partial points for same country/time-zone.
       - 0 points for completely different regions (unless remote is implied in description).
       - 0 points for unspecified preference.

    ### OUTPUT REQUIREMENTS
    Return a JSON array where each object contains:
    - "job_id": The exact ID from the input.
    - "rank": 1 being the best fit.
    - "score": Integer between 0-100.
    - "reasoning": A concise, plaintext explanation (2-3 sentences). Explain *why* it got this score, specifically referencing matched/missing skills and location alignment.

    ### INPUT DATA
    ${jsonInput}
  `;

  const llmResponse = await genai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  const llmResult = llmResponse.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!llmResult) {
    throw new Error("LLM did not return a resposne" + "\n" + "LLM RESPONSE: " + llmResponse);
  }

  const rankedJobs = JSON.parse(llmResult);
  console.log(rankedJobs);

}
