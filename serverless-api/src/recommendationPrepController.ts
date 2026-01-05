import { v4 as uuidv4 } from "uuid";

import { gqlSdk } from "./config/graphqlClient.ts";
import { getTemporalClient } from "./config/temporalClient.ts";
import type { InterviewPrepWorkflowInput } from "./config/types.ts";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const eventbody = JSON.parse(event.body || "{}");
  const { rec_id } = (eventbody.input || eventbody);
  const user_id = eventbody.session_variables["x-hasura-user-id"];

  if (!user_id) {
    return {
      statusCode: 403,
      body: JSON.stringify({ "message": "user not provided" })
    }
  }

  if (!rec_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "recommendation not provided" })
    }
  }

  const recomResult = await gqlSdk.CheckRecommendationOwnershipAndExistence({ rec_id: Number(rec_id), user_id: Number(user_id) });
  if (recomResult.recommendation.length != 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "recommendation does not exist" })
    }
  }

  try {
    const workflowHandle = await startRecommendationPrepWorkflow({
      recId: rec_id
    });

    if (workflowHandle.status) {
      return {
        statusCode: 200,
        body: JSON.stringify({ "message": `workflow started sucessfully with the workflow id: ${workflowHandle.id}`, workflowId: workflowHandle.id })
      }
    }

    else {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "workflow could not be started" })
      }
    }
  }
  catch (e) {
    console.error((e as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ "message": "workflow could not be started", "detail": (e as Error).message })
    }
  }

}

async function startRecommendationPrepWorkflow(workflowInput: InterviewPrepWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    console.log("trying to connect");
    const temporalClient = await getTemporalClient();
    console.log("gotten client");

    const handle = await temporalClient.workflow.start(
      "interviewPrepWorkflow",
      {
        args: [workflowInput],
        taskQueue: "ranking-queue",
        workflowId: `workflow-prep-${uuidv4()}`
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
