import { matchSkillsInput, RankingWorkflowInput } from "../config/types";
import { getDBClient } from "../config/db";
import { connectDB } from "../config/db";
import { PG } from "../config/config.ts";

export async function getJobsActivity(rankingInput: RankingWorkflowInput): Promise<matchSkillsInput> {
  let client = getDBClient();
  if (client instanceof Error) {
    console.log("DB could not be gotten");
    throw Error("No DB client available");
  }

  const resumeEmbeddingQuery = `
                               SELECT embedding, extracted_skills
                               FROM resume
                               WHERE id = $1 AND user_id = $2;
                               `;
  const resumeEmbeddingResult = await client.query(resumeEmbeddingQuery, [rankingInput.resume_id, rankingInput.user_id]);
  const embedding = resumeEmbeddingResult.rows[0].embedding;
  const extracted_skills = resumeEmbeddingResult.rows[0].extracted_skills;

  const top100Queries = `
                        SELECT id, title, company, description, skills, location, 
                               embedding, url, search_title , search_pref_country, search_pref_area
                        FROM job
                        ORDER BY embedding <=> $1
                        LIMIT 100;
                       `;
  const top100Result = await client.query(top100Queries, [embedding]);
  const jobs = top100Result.rows;

  return { jobs: jobs, resume_skills: extracted_skills };
}
