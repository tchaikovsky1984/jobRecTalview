import { GetJobsOutput, RankingWorkflowInput } from "../config/types";
import { getDBClient } from "../config/db";

export async function getJobsActivity(rankingInput: RankingWorkflowInput): Promise<GetJobsOutput> {
  let client = getDBClient();
  if (client instanceof Error) {
    console.log("DB could not be gotten");
    throw client;
  }

  const resumeEmbeddingQuery = `
                               SELECT embedding, summary, extracted_skills
                               FROM resume
                               WHERE id = $1 AND user_id = $2;
                               `;
  const resumeEmbeddingResult = await client.query(resumeEmbeddingQuery, [rankingInput.resume_id, rankingInput.user_id]);
  const embedding = resumeEmbeddingResult?.rows[0]?.embedding;
  const summary = resumeEmbeddingResult?.rows[0]?.summary;
  const extracted_skills = resumeEmbeddingResult?.rows[0]?.extracted_skills;

  const top50Queries = `
                        SELECT id, title, company, description, skills, location, 
                               embedding, url, search_title , search_pref_country, search_pref_area
                        FROM job
                        ORDER BY embedding <=> $1
                        LIMIT 50;
                       `;
  const top50Result = await client.query(top50Queries, [embedding]);
  const jobs = top50Result.rows;

  return { jobs: jobs, resume_skills: extracted_skills, summary: summary };
}
