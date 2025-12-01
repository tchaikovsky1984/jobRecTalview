import type { Request, Response } from "express";
import { Connection, Client } from "@temporalio/client";
import { v4 as uuidv4 } from "uuid";
import type { RequestHandler } from "express";

import type { ResumeAnalysisParam } from "../config/types.ts";
import type { ResumeWorkflowInput } from "../config/types.ts";
import { getDBClient } from "../db/connection.ts";
import { displayLog } from "../middleware/LoggingRequests.ts";

export const resumeAnalysisController: RequestHandler<ResumeAnalysisParam> = async (req, res) => {

  const id: number = req.params.id;
  const userId: number = (req as any).user.sub;

  try {
    const client = getDBClient();
    if (client instanceof Error) {
      res.status(500).json({ "message": "could not get DB" });
      return;
    }

    const validationQuery = `
    SELECT *
      FROM "resume"
    WHERE id = $1
    AND user_id =$2
    `;

    const result = await client.query(validationQuery, [id, userId]);
    if (result.rowCount == 0) {
      res.status(402).json({ "message": "resume does not exist" });
      return;
    }

    const resumePath = result.rows[0].filepath; // Get path from DB result

    const workflowStarted = await startResumeWorkflow({
      res_id: id,      // Match Python snake_case
      user_id: userId, // Match Python snake_case
      filepath: resumePath
    });

    if (workflowStarted) {
      res.status(200).json({ message: "Analysis started successfully" });
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

async function startResumeWorkflow(resInfo: ResumeWorkflowInput): Promise<boolean> {
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

    return true;
  }
  catch (e) {
    displayLog(String(e), "ERR");
    return false;
  }
}
