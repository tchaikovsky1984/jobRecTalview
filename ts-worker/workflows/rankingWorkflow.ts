import { proxyActivities } from "@temporalio/workflow";
import type { ActivityOptions } from "@temporalio/workflow";

import * as gettingJobsActivities from "../activities/getJobsActivity";
import * as matchingSkillsActivities from "../activities/matchSkillsActivity.ts";
import * as llmActivities from "../activities/llmRankingActivity.ts";
import { JobsWithSkills, matchSkillsInput } from "../config/types.ts"
import { RankingWorkflowInput } from "../config/types";

export async function RankingWorkflow(rankingInput: RankingWorkflowInput) {
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

  const matchingInput: matchSkillsInput = await getJobsActivity(rankingInput);

  const matchingOutput: JobsWithSkills[] = await matchSkillsActivity(matchingInput);

  await llmRankingActivity({ job: matchingOutput, resume: rankingInput });

}
