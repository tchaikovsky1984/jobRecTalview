import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "./config/config.ts";
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";

function _generatePolicy(action: any, effect: any, resource: any) {
  return {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": action,
        "Effect": effect,
        "Resource": resource
      }
    ]
  };
}

export async function authenticateToken(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {

  const env = {
    S3_BUKETNAME: process.env.S3_BUCKET_NAME,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    AWS_REGION_NAME: process.env.AWS_REGION_NAME,
    HASURA_GRAPHQL_URL: process.env.HASURA_GRAPHQL_URL,
    HASURA_ADMIN_SECRET: process.env.HASURA_ADMIN_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    TEMPORAL_ADDRESS: process.env.TEMPORAL_ADDRESS
  }

  console.log(env);

  const auth_header = event.authorizationToken;
  const method_arn = event.methodArn;
  if (!auth_header) {
    return {
      principalId: "",
      policyDocument: _generatePolicy("execute-api:Invoke", "Deny", method_arn),
      context: {
        message: "Auth Header Missing"
      }
    };
  }

  const bearer = auth_header.split(' ')[0];
  const token = auth_header.split(' ')[1];

  if (bearer !== "Bearer") {
    return {
      principalId: "",
      policyDocument: _generatePolicy("execute-api:Invoke", "Deny", method_arn),
      context: {
        message: "Malformed JWT (No bearer)"
      }
    };
  }
  if (!token) {
    return {
      principalId: "",
      policyDocument: _generatePolicy("execute-api:Invoke", "Deny", method_arn),
      context: {
        message: "Authorisation Token Not Provided"
      }
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    return {
      principalId: decoded.sub || "unknown-user",
      policyDocument: _generatePolicy("execute-api:Invoke", "Allow", method_arn),
      context: {
        userId: decoded.sub || "",
        iat: decoded.iat || "",
        exp: decoded.exp || "",
      }
    };

  }
  catch (err) {
    console.error("Token verification failed:", err);
    return {
      principalId: "user",
      policyDocument: _generatePolicy("execute-api:Invoke", "Deny", method_arn),
      context: {
        message: "Invalid Token"
      }
    };
  }
}
