import { log } from "@temporalio/workflow";

import { RankingWorkflowInput } from "../config/types";
import { Jobs } from "../config/types.ts";
import { getDBClient } from "../config/db";

export async function getJobsActvity(rankingInput: RankingWorkflowInput): Promise<Jobs[]> {
  const client = getDBClient();
  if (client instanceof Error) {
    log.error("DB could not be gotten");
    throw Error("No DB client available");
  }

  const resumeEmbeddingQuery = `
                               SELECT embedding
                               FROM resume
                               WHERE id = $1 AND userId = $2;
                               `;
  const resumeEmbeddingResult = await client.query(resumeEmbeddingQuery, [rankingInput.resume_id]);
  const embedding = resumeEmbeddingResult.rows[0].embedding;

  const top100Queries = `
                        SELECT *
                        FROM job
                        ORDER BY embedding <=> $1
                        LIMIT 100;
                       `;
  const top100Result = await client.query(top100Queries, [embedding]);
  const jobs = top100Result.rows;

  return jobs;
}
