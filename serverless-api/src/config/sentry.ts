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
    const user_id = eventbody.session_variables["x-hasura-user-id"];

    if (user_id) {
      Sentry.setUser({ user_id: user_id });
    }

    Sentry.setTag("route", event.path);

    return await handler(event);
  };

  return Sentry.wrapHandler(interceptReq);

}
