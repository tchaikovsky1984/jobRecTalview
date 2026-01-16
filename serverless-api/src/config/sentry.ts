import * as Sentry from "@sentry/aws-serverless";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

type asyncFunc = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
type syncFunc = (event: APIGatewayProxyEvent) => APIGatewayProxyResult;
type ApiHandler = asyncFunc | syncFunc

export function addSentry(handler: ApiHandler): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> {

  const interceptReq = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const eventbody = JSON.parse(event.body || "{}");
    const ip = event.requestContext.identity.sourceIp;

    Sentry.setTag("route", event.path);

    Sentry.addBreadcrumb({
      category: "lambda",
      message: "lambda execution started for " + event.path,
      level: "info",
      data: {
        queryParams: event.queryStringParameters,
        body: eventbody
      }
    })

    return await handler(event);
  };

  return Sentry.wrapHandler(interceptReq);

}
