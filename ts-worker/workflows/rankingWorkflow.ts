import { proxyActivities } from "@temporalio/workflow";
import type { ActivityOptions } from "@temporalio/workflow";

import * as gettingJobsActivities from "../activities/getJobsActivity";
import * as matchingSkillsActivities from "../activities/matchSkillsActivity.ts";
import * as llmActivities from "../activities/llmRankingActivity.ts";
import * as storageActivities from "../activities/storeRankingActivity.ts";
import { JobsWithSkills, LLMInput } from "../config/types.ts";
import { GetJobsOutput } from "../config/types.ts";
import { matchSkillsInput } from "../config/types.ts"
import { RankingWorkflowInput } from "../config/types";
import { LLMOutput } from "../config/types.ts";

export async function RankingWorkflow(rankingInput: RankingWorkflowInput): Promise<boolean> {
  // ensuring that persistent client is avaiable.

  const getJobsOptions: ActivityOptions = {
    startToCloseTimeout: '1 minute',
    retry: {
      maximumAttempts: 5
    }
  };
  const { getJobsActivity } = proxyActivities<typeof gettingJobsActivities>(getJobsOptions);

  const matchSkillOptions: ActivityOptions = {
    startToCloseTimeout: '30 second',
    retry: {
      maximumAttempts: 5
    }
  };
  const { matchSkillsActivity } = proxyActivities<typeof matchingSkillsActivities>(matchSkillOptions)

  const llmRankingOptions: ActivityOptions = {
    startToCloseTimeout: '10 minute',
    retry: {
      maximumAttempts: 5,
      backoffCoefficient: 2,
      initialInterval: 4000
    }
  };
  const { llmRankingActivity } = proxyActivities<typeof llmActivities>(llmRankingOptions);

  const storeRankingOptions: ActivityOptions = {
    startToCloseTimeout: '1 minute',
    retry: {
      maximumAttempts: 1,
      initialInterval: 2000
    }
  }
  const { storeRankingActivity } = proxyActivities<typeof storageActivities>(storeRankingOptions);

  const getJobsOutput: GetJobsOutput = await getJobsActivity(rankingInput);
  const matchingInput: matchSkillsInput = { jobs: getJobsOutput.jobs, resume_skills: getJobsOutput.resume_skills };

  const matchingOutput: JobsWithSkills[] = await matchSkillsActivity(matchingInput);
  console.log(matchingOutput.length);

  const llmInput: LLMInput = { job: matchingOutput, resume: rankingInput, summary: getJobsOutput.summary };
  const llmOutput: LLMOutput = await llmRankingActivity(llmInput);

  console.log(llmOutput.llmOuput.length);

  const workflowResult: boolean = await storeRankingActivity(llmOutput);

  return workflowResult;
}
