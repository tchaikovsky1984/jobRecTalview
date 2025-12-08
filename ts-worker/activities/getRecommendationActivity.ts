import { getDBClient } from "../config/db";
import { InterviewPrepWorkflowInput, RecJob, Recommendation, RecResume } from "../config/types";

export async function getRecommendationActivity(recommendationId: InterviewPrepWorkflowInput): Promise<Recommendation> {
  const client = getDBClient();
  if (client instanceof Error) {
    console.log("DB Could not be gotten");
    throw client;
  }

  const recQuery = `SELECT id, res_id, job_id, score, reasoning, skill_matches, skill_misses
                 FROM recommendation
                 WHERE id = $1`;

  const recQueryResult = await client.query(recQuery, [recommendationId.recId]);

  const recommendation = recQueryResult?.rows?.[0];
  if (!recommendation) throw new Error("No such recommendation");

  const jobQuery = `SELECT title, company, description, skills, location
                    FROM job
                    WHERE id = $1`;

  const jobQuerResult = await client.query(jobQuery, [recommendation.job_id ? recommendation.job_id : 0]);

  const job: RecJob = jobQuerResult?.rows?.[0];

  const resumeQuery = `SELECT extracted_skills, summary
                       FROM resume
                       WHERE id = $1`;

  const resumeQueryResult = await client.query(resumeQuery, [recommendation.res_id ? recommendation.res_id : 0]);

  const resume: RecResume = resumeQueryResult?.rows?.[0];

  if (!job || !resume) throw new Error("No such resume or job");

  return { ...recommendation, job: job, resume: resume };
}
