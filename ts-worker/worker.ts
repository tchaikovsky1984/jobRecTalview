import { Worker } from '@temporalio/worker';

import { getJobsActivity } from "./activities/getJobsActivity.ts";
import { llmRankingActivity } from "./activities/llmRankingActivity.ts";
import { matchSkillsActivity } from "./activities/matchSkillsActivity.ts";
import { storeRankingActivity } from './activities/storeRankingActivity.ts';
import { getRecommendationActivity } from './activities/getRecommendationActivity.ts';
import { llmPrepActivity } from './activities/llmPrepActivity.ts';
import { storePrepActivity } from './activities/storePrepActivity.ts';
import { PG } from "./config/config.ts";
import { connectDB } from "./config/db.ts";

async function run() {
  console.log("Initializing Database Connection...");
  const client = await connectDB(PG);

  if (!client) {
    console.error("Failed to connect to DB. Worker exiting.");
    process.exit(1); // Fail Fast: Don't start the worker if DB is down
  }
  console.log("DB Connected Successfully.");

  const workerRank = await Worker.create({
    workflowsPath: require.resolve('./workflows/workflows.ts'),
    taskQueue: 'ranking-queue',
    activities: { getJobsActivity, llmRankingActivity, matchSkillsActivity, storeRankingActivity, getRecommendationActivity, llmPrepActivity, storePrepActivity },
  });

  await workerRank.run();
}

run().catch((err) => {
  console.log(String(err));
  console.log("worker could not start");
});
