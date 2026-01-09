import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import * as Sentry from "@sentry/aws-serverless";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
})

async function rawcontroller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  throw new Error("demo error");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "this isnt supposed to get here."
    })
  }
}

export const controller = Sentry.wrapHandler(rawcontroller);
