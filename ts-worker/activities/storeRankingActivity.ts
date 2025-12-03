import { getDBClient } from "../config/db";
import { LLMOutput } from "../config/types";

export async function storeRankingActivity(rankedJobsWithResume: LLMOutput): boolean {
  const client = getDBClient();
  if (client instanceof Error) {
    console.log("could not get DB");
    throw client;
  }

  const jobsList = rankedJobsWithResume.llmOuput;
  const resumeObject = rankedJobsWithResume.resume;



  return true;
}
