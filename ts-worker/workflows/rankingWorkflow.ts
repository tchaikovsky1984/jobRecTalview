import { proxyActivities } from "@temporalio/workflow";
import { getJobsActvity } from "../activities/getJobsActivity";
import { RankingWorkflowInput } from "../config/types";

/*
export async function rankingWorkflow(rankingInput: RankingWorkflowInput) {
  const { getJob } = proxyActivities < typeof getJobsActvity() > ({
    startToCloseTimeout: '1 minute'
  });
}
*/
