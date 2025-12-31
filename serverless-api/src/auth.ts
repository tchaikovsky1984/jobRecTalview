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
