import type { LLMJobOutput, LLMJobOutputSingleton, RankingWorkflowInput } from "../config/types.ts";
import { gqlSdk } from "../config/graphqlClient.ts";

export function toPgArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "{}";
  const formatted = arr.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');
  return `{${formatted}}`;
}

export async function storeRankingActivity(jobsListWithResume: LLMJobOutput): Promise<boolean> {

  const jobsList: LLMJobOutputSingleton[] = jobsListWithResume.llmOuput;
  const resumeObject: RankingWorkflowInput = jobsListWithResume.resume;

  if (jobsList.length === 0) {
    return false
  }

  try {

    const payload = jobsList.map(job => ({
      res_id: resumeObject.resume_id,
      job_id: job.job_id,
      score: job.score,
      reasoning: job.reasoning,
      skill_matches: toPgArray(job.matching_skills),
      skill_misses: toPgArray(job.missing_skills)
    }));

    console.log(payload);

    const id = await gqlSdk.BulkInsertRecommendation({ objects: payload });
    if (!id.insert_recommendation?.affected_rows || id.insert_recommendation.affected_rows === 0) {
      return false;
    }

    return true;

  }
  catch (e) {
    console.error("Bulk Insert Failed:", e);
    throw e;
  }

}
