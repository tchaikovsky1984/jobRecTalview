import type { Request, Response } from "express";
import { Connection, Client } from "@temporalio/client";
import { v4 as uuidv4 } from "uuid";
import type { RequestHandler } from "express";

import type { ResumeAnalysisParam } from "../config/types.ts";
import type { ResumeWorkflowInput } from "../config/types.ts";
import { gqlSdk } from "../config/graphqlClient.ts";
import { displayLog } from "../middleware/LoggingRequests.ts";

export const resumeAnalysisController: RequestHandler<ResumeAnalysisParam> = async (req, res) => {

  const id: number = req.params.id;
  const userId: number = (req as any).user.sub;

  try {

    const result = await gqlSdk.CheckResumeOwnership({ id: Number(id), user_id: Number(userId) });
    if (result.resume.length == 0) {
      res.status(402).json({ "message": "resume does not exist" });
      return;
    }

    const resumePath = result.resume[0]?.filepath; // Get path from DB result
    if (!resumePath) {
      res.status(500).json({ "message": "filepath not available" });
      return;
    }

    const workflowStarted = await startResumeWorkflow({
      res_id: id,      // Match Python snake_case
      user_id: userId, // Match Python snake_case
      filepath: resumePath
    });

    if (workflowStarted.status) {
      res.status(200).json({ message: "Analysis started successfully", workflowID: workflowStarted.id });
    } else {
      res.status(500).json({ message: "Failed to start workflow" });
    }
  }
  catch (e) {
    displayLog(String(e), "ERR");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  return

}

async function startResumeWorkflow(resInfo: ResumeWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    const con = await Connection.connect({ address: "localhost:7233" });
    const temporalClient = new Client({ con });

    const handle = await temporalClient.workflow.start("ResumeProcessingWorkflow",
      {
        args: [resInfo],
        taskQueue: "resume-queue",
        workflowId: `workflow-resume-${uuidv4()}`
      });

    console.log(`Started workflow with id: ${handle.workflowId}`);

    return { status: true, id: handle.workflowId };
  }
  catch (e) {
    displayLog(String(e), "ERR");
    return { status: false };
  }
}
