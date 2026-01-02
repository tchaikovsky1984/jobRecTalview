import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { JobSearchWorkflowInput } from "./config/types";
import { getTemporalClient } from "./config/temporalClient";
import { v4 as uuidv4 } from "uuid";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const user_id: number = Number(event.requestContext.authorizer?.userId);

  if (!user_id) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "user not provided" })
    };
  }

  try {
    const jobCriteria: JobSearchWorkflowInput = JSON.parse(event.body || "{}");
    if (!jobCriteria.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "required field (title) not provided" })
      };
    }

    const workflowStarted = await startJobSearchWorkflow(jobCriteria);

    if (!workflowStarted.status) {
      console.log("failed to start workflow");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to start search workflow" })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Starterd search workflow with id: " + workflowStarted.id })
    };


  }
  catch (e) {
    console.error((e as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (e as Error).name, detail: (e as Error).message })
    };
  }
}

async function startJobSearchWorkflow(workflowInput: JobSearchWorkflowInput): Promise<{ status: boolean, id?: string }> {
  try {
    const temporalClient = await getTemporalClient();

    const handle = await temporalClient.workflow.start(
      "ScrapingJobsWorkflow",
      {
        args: [workflowInput],
        taskQueue: "scrape-queue",
        workflowId: `workflow-job-ranking-${uuidv4()}`
      }
    );

    console.log(`Started workflow with id: ${handle.workflowId}`);

    return {
      status: true,
      id: handle.workflowId
    }

  }
  catch (e) {
    console.log("could not start workflow");
    console.error((e as Error).message);
    return {
      status: false
    };
  }
}
