import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { gqlSdk } from "./config/graphqlClient.ts";
import bcrypt from "bcryptjs";

export async function controller(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  const eventbody = JSON.parse(event.body || '{}');
  const { username, email, name, password } = eventbody.input || eventbody;
  const saltRounds: number = 10;
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!username || username.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "username not provided" })
    }
  }
  if (!email || email.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "email not provided" })
    }
  }
  if (!email.match(emailRegex)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "invalid email" })
    }
  }
  if (!password || password.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "password not provided" })
    }
  }
  if (!name || name.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": "name not provided" })
    }
  }
  if (password.length < 8 || password.length > 20) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "message": `pinvalid password ${password.length < 8 ? "(at least 8 chars)" : "(at most 20 chars)"}` })
    }
  }

  try {
    console.log("reached inside try");
    const hashed_pwd: string = await bcrypt.hash(password, saltRounds);
    console.log(hashed_pwd);

    const sameUser = await gqlSdk.CheckUserAlreadyExists({ username: username, email: email })
    console.log(sameUser);

    if (sameUser.user.length > 0)
      return {
        statusCode: 400,
        body: JSON.stringify({ "message": "user exists with username or email" })
      };

    const result = await gqlSdk.CreateUser({ username: username, email: email, name: name, password_hash: hashed_pwd });

    const newUserId = result.insert_user_one?.id; // The ID of the newly inserted user
    if (!newUserId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ "message": "could not be registered" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ "message": "Registration successful", "userId": newUserId })
    };
  }
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ "message": err instanceof Error ? err.message : String(err) })
    };
  }

}
