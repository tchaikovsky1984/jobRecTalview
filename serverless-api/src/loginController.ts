import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { LoginRequestBody } from "./config/types.ts";
import { gqlSdk } from "./config/graphqlClient.ts";
import { JWT_SECRET } from "./config/config.ts";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { username, password } = JSON.parse(event.body || "{}") as LoginRequestBody;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "Username and password are required" })
      };
    }

    const res_saved_hashed_pwd = await gqlSdk.SelectUserAndPassword({ username: username })

    if (res_saved_hashed_pwd.user.length == 0 || !res_saved_hashed_pwd.user[0] || !res_saved_hashed_pwd.user[0].id || !res_saved_hashed_pwd.user[0].username || !res_saved_hashed_pwd.user[0].password_hash) {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "No such user exists" })
      }
    }

    const saved_hashed_pwd = res_saved_hashed_pwd.user[0].password_hash;
    const passwordCondition: boolean = await bcrypt.compare(password, saved_hashed_pwd);

    if (passwordCondition) {
      const user_id = res_saved_hashed_pwd.user[0].id.toString();
      const HASURA_CLAIMS_NAMESPACE = "https://hasura.io/jwt/claims";

      const hasuraClaims = {
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user_id, // The ID extracted from the DB
      };

      const payload = {
        [HASURA_CLAIMS_NAMESPACE]: hasuraClaims,
        "sub": user_id,
        "iat": Math.floor(Date.now() / 1000), // Issued At (current timestamp)
      };

      const accessToken = jwt.sign(
        payload,
        JWT_SECRET,
        {
          algorithm: 'HS256', // Must match the "type" in your docker-compose.yml
          expiresIn: '24h'    // Token expiration
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          "message": "Login successful. Token generated",
          "access_token": accessToken,
          "user_id": user_id
        })
      };
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "Wrong Password" })
      }
    }

  }
  catch (err: any) {
    console.log(err.toString(), "ERR");
    return {
      statusCode: 500,
      body: JSON.stringify({
        "access_token": "",
        "user_id": "",
        "message": err.message
      })
    };
  }

}
