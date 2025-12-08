import { proxyActivities } from "@temporalio/workflow";
import type { ActivityOptions } from "@temporalio/workflow";

import * as gettingRecommendationActivities from "../activities/getRecommendationActivity";
import * as llmPreppingActivities from "../activities/llmPrepActivity.ts";
import * as storingPrepActivities from "../activities/storePrepActivity.ts";
import { InterviewPrepWorkflowInput, LLMPrepOutput, Recommendation } from "../config/types";
import { connectDB } from "../config/db";
import { PG } from "../config/config";
import { ActivityCompletionError } from "@temporalio/client";

export async function interviewPrepWorkflow(recommendationId: InterviewPrepWorkflowInput): Promise<void> {

  const getRecommendationOptions: ActivityOptions = {
    startToCloseTimeout: '10 second',
    retry: {
      maximumAttempts: 3
    }
  };

  const { getRecommendationActivity } = proxyActivities<typeof gettingRecommendationActivities>(getRecommendationOptions);

  const llmPrepOptions: ActivityOptions = {
    startToCloseTimeout: '3 minute',
    retry: {
      maximumAttempts: 5,
      backoffCoefficient: 2,
      initialInterval: '10 second',
    }
  };

  const { llmPrepActivity } = proxyActivities<typeof llmPreppingActivities>(llmPrepOptions);

  const storePrepOptions: ActivityOptions = {
    startToCloseTimeout: '10 second',
    retry: {
      maximumAttempts: 3
    }
  };

  const { storePrepActivity } = proxyActivities<typeof storingPrepActivities>(storePrepOptions);

  const recommendation: Recommendation = await getRecommendationActivity(recommendationId);

  const answer: LLMPrepOutput = await llmPrepActivity(recommendation);

  const result: boolean = await storePrepActivity({ prep: answer, recommendation_id: recommendation.id });

  // store in DB
  return;
};
