import type { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { LoginRequestBody, LoginResponseBody } from "../config/types.ts";
import { displayLog } from "../middleware/LoggingRequests.ts";
import { gqlSdk } from "../config/graphqlClient.ts";
import { JWT_SECRET } from "../config/config.ts";

export async function loginController(req: Request<{}, {}, LoginRequestBody>, res: Response<LoginResponseBody, {}>, next: NextFunction): Promise<void> {

  const { username, password } = req.body;

  displayLog(JWT_SECRET, "LOG");

  try {

    const res_saved_hashed_pwd = await gqlSdk.SelectUserAndPassword({ username: username })

    if (res_saved_hashed_pwd.user.length == 0 || !res_saved_hashed_pwd.user[0]) {
      res.status(400).json({ "access_token": "", "user_id": "", "message": "no such user exists" });
      return
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

      res.status(200).json({
        access_token: accessToken,
        user_id: user_id,
        message: "Login successful. Token generated."
      });
      return;

    }
    else {
      res.status(400).json({ "access_token": "", "user_id": "", "message": "wrong password" });
      return
    }

  }
  catch (err: any) {
    displayLog(err, "ERR");
    res.status(500).json({
      "access_token": "",
      "user_id": "",
      "message": "Internal Server Error during login."

    });
  }
}


