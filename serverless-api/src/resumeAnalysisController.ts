import { v4 as uuidv4 } from "uuid";

import type { ResumeAnalysisParam, ResumeWorkflowInput } from "./config/types.ts";
import { getTemporalClient } from "./config/temporalClient.ts"
import { gqlSdk } from "./config/graphqlClient.ts";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  const id: number = Number(event.pathParameters?.id);
  const userId: number = Number(event.requestContext.authorizer?.userId);
  console.log(id);
  console.log(userId);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "resume not provided" })
    };
  }
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "user not provided" })
    };
  }

  try {

    const result = await gqlSdk.CheckResumeOwnership({ id: Number(id), user_id: Number(userId) });
    if (result.resume.length == 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ "message": "resume does not exist" })
      };
    }

    const resumePath = result.resume[0]?.filepath; // Get path from DB result
    if (!resumePath) {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "filepath not available" })
      };
    }

    const workflowStarted = await startResumeWorkflow({
      res_id: id,      // Match Python snake_case
      user_id: userId, // Match Python snake_case
      filepath: resumePath
    });

    if (workflowStarted.status) {
      return {
        statusCode: 200,
        body: JSON.stringify({ "message": "Analysis started successfully.", "workflowID": workflowStarted.id })
      };
    }
    else {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "Failed to start workflow" })
      };
    }
  }
  catch (e) {
    console.error((e as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ "message": "Internal Serever Error" })
    };
  }

}

async function startResumeWorkflow(resInfo: ResumeWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    console.log("trying to get client");
    const temporalClient = await getTemporalClient();
    console.log("gotten client");

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
    console.error((e as Error).message);
    return { status: false };
  }
}
