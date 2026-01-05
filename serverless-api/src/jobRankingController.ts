import { v4 as uuidv4 } from "uuid";

import { gqlSdk } from "./config/graphqlClient.ts";
import type { RankingWorkflowInput } from "./config/types.ts";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getTemporalClient } from "./config/temporalClient.ts";


export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const eventbody = JSON.parse(event.body || "{}");
  const { res_id } = (eventbody.input || eventbody);
  const user_id: number = eventbody.session_variables["x-hasura-user-id"];
  if (!res_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "no resume specified" })
    }
  }
  if (!user_id) {
    return {
      statusCode: 403,
      body: JSON.stringify({ "message": "decoded jwt not provided" })
    }
  }

  try {
    const resumeCheck = await gqlSdk.CheckResumeOwnership({ id: Number(res_id), user_id: Number(user_id) })
    if (resumeCheck.resume.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "no such resume exists" })
      }
    }

    const workflowStarted = await startJobRankingWorkflow({
      resume_id: Number(res_id),
      user_id: Number(user_id),
    });

    if (workflowStarted.status) {
      return {
        statusCode: 200,
        body: JSON.stringify({ "message": "Ranking started successfully", workflowId: workflowStarted.id })
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "Failed to start workflow" })
      }
    }
  }
  catch (e) {
    console.error((e as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ "message": "Internal Server Error" })
    }
  }
}

export async function startJobRankingWorkflow(workflowInput: RankingWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    console.log("trying to get client");
    const temporalClient = await getTemporalClient();
    console.log("gotten client");

    const handle = await temporalClient.workflow.start(
      "RankingWorkflow",
      {
        args: [workflowInput],
        taskQueue: "ranking-queue",
        workflowId: `workflow-job-ranking-${uuidv4()}`
      }
    );

    console.log(`Started workflow with id: ${handle.workflowId}`);

    return { status: true, id: handle.workflowId };
  }
  catch (e) {
    console.error((e as Error).message);
    return { status: false };
  }
}
