import { getDBClient } from "../config/db";
import { LLMOutput, LLMOutputSingleton, RankingWorkflowInput } from "../config/types";

export async function storeRankingActivity(jobsListWithResume: LLMOutput): Promise<boolean> {
  const client = getDBClient();
  if (client instanceof Error) {
    console.log("could not get DB");
    throw client;
  }

  const jobsList: LLMOutputSingleton[] = jobsListWithResume.llmOuput;
  const resumeObject: RankingWorkflowInput = jobsListWithResume.resume;

  if (jobsList.length === 0) {
    return false;
  }

  try {

    const payload = JSON.stringify(jobsList.map(job => ({
      res_id: resumeObject.resume_id,
      job_id: job.job_id,
      score: job.score,
      reasoning: job.reasoning,
      skill_matches: job.matching_skills || [],
      skill_misses: job.missing_skills || []
    })));

    console.log(payload);

    const query = `
    INSERT INTO recommendation (
          res_id, job_id, score, reasoning, skill_matches, skill_misses 
      )
      SELECT * FROM json_to_recordset($1) AS x(
          res_id int, 
          job_id int, 
          score int, 
          reasoning text, 
          skill_matches text[],  
          skill_misses text[]
      )
      ON CONFLICT (res_id, job_id) 
      DO UPDATE SET 
        score = EXCLUDED.score, 
        reasoning = EXCLUDED.reasoning,
        skill_matches = EXCLUDED.skill_matches,
        skill_misses = EXCLUDED.skill_misses;
    `;

    await client.query(query, [payload]);

    return true;

  }
  catch (e) {
    console.error("Bulk Insert Failed:", e);
    throw e;
  }

}
