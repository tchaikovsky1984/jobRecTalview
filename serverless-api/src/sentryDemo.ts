import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { addSentry } from "./config/sentry";

async function rawcontroller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  throw new Error("demo error");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "this isnt supposed to get here."
    })
  }
}

export const controller = addSentry(rawcontroller);
