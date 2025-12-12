import type { Request, Response } from "express";
import { Connection, Client } from "@temporalio/client";
import { v4 as uuidv4 } from "uuid";

import { gqlSdk } from "../config/graphqlClient.ts";
import type { RankingWorkflowInput } from "../config/types.ts";
import { displayLog } from "../middleware/logger.ts";


export async function jobRankingController(req: Request, res: Response) {
  const res_id = req.params.id;
  const user_id = (req as any).user?.sub;
  if (!res_id) {
    res.status(400).json({ "message": "no resume specified" });
    return;
  }
  if (!user_id) {
    res.status(403).json({ "message": "decoded jwt not provided" });
    return;
  }

  try {
    const resumeCheck = await gqlSdk.CheckResumeOwnership({ id: Number(res_id), user_id: Number(user_id) })
    if (resumeCheck.resume.length === 0) {
      res.status(400).json({ "message": "no such resume exists" });
      return;
    }

    const workflowStarted = await startJobRankingWorkflow({
      resume_id: Number(res_id),
      user_id: Number(user_id),
    });

    if (workflowStarted.status) {
      res.status(200).json({ message: "Ranking started successfully", workflowID: workflowStarted.id });
    } else {
      res.status(500).json({ message: "Failed to start workflow" });
    }
    return;
  }
  catch (e) {
    displayLog(String(e), "ERR");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function startJobRankingWorkflow(workflowInput: RankingWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    const con = await Connection.connect({ address: "localhost:7233" });
    const temporalClient = new Client({ con });

    const handle = await temporalClient.workflow.start(
      "RankingWorkflow",
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
