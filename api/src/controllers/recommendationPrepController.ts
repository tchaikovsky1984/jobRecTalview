import { Connection, Client } from "@temporalio/client";
import { v4 as uuidv4 } from "uuid";

import type { Request, Response } from "express";
import { gqlSdk } from "../config/graphqlClient.ts";
import { displayLog } from "../middleware/logger.ts";
import type { InterviewPrepWorkflowInput } from "../config/types.ts";

export async function recommendationPrepController(req: Request, res: Response): Promise<void> {
  const rec_id = Number(req.params.id);
  const user_id = (req as any).user.sub;

  if (!user_id) {
    res.status(400).json({ "message": "user not provided" });
    return;
  }

  if (!rec_id) {
    res.status(400).json({ "message": "recommendation not provided" });
    return;
  }

  const recomResult = await gqlSdk.CheckRecommendationOwnershipAndExistence({ rec_id: Number(rec_id), user_id: Number(user_id) });
  if (recomResult.recommendation.length != 1) {
    res.status(400).json({ "message": "recommendation does not exist" });
    return;
  }

  try {
    const workflowHandle = await startRecommendationPrepWorkflow({
      recId: rec_id
    });

    if (workflowHandle.status) {
      res.status(200).json({ "message": `workflow started sucessfully with the workflow id: ${workflowHandle.id}` });
      return;
    }

    else {
      res.status(500).json({ "message": `workflow could not be started` });
      return;
    }
  }
  catch (e) {
    displayLog(String(e), "ERR");
    res.status(500).json({ "message": `workflow could not be started`, "detail": e });
    return;
  }

}

async function startRecommendationPrepWorkflow(workflowInput: InterviewPrepWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    const con = await Connection.connect({ address: "localhost:7233" });
    const temporalClient = new Client({ con });

    const handle = await temporalClient.workflow.start(
      "interviewPrepWorkflow",
      {
        args: [workflowInput],
        taskQueue: "ranking-queue",
        workflowId: `workflow-ranking-${uuidv4()}`
      }
    );

    console.log(`Started workflow with id: ${handle.workflowId}`);

    return { status: true, id: handle.workflowId };
  }
  catch (e) {
    displayLog(String(e), "ERR");
    return { status: false };
  }
}
