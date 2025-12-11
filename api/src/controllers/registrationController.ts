import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import type { RegisterRequestBody } from "../config/types.ts"
import { gqlSdk } from "../config/graphqlClient.ts";

export async function registrationController(req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> {

  const { username, email, name, password } = req.body;
  const saltRounds: number = 10;
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!username || username.length < 1) {
    res.status(400).json({ "error": "username not provided" });
    return;
  }
  if (!email || email.length < 1) {
    res.status(400).json({ "error": "email not provided" });
    return;
  }
  if (!email.match(emailRegex)) {
    res.status(400).json({ "error": "invalid email" });
    return;
  }
  if (!password || password.length < 1) {
    res.status(400).json({ "error": "password not provided" });
    return;
  }
  if (!name || name.length < 1) {
    res.status(400).json({ "error": "name not provided" });
    return;
  }
  if (password.length < 8 || password.length > 20) {
    res.status(400).json({ "error": `invalid password ${password.length < 8 ? "(at least 8 chars)" : "(at most 20 chars)"}` });
    return;
  }

  try {
    const hashed_pwd: string = await bcrypt.hash(password, saltRounds);

    const sameUser = await gqlSdk.CheckUserAlreadyExists({ username: username, email: email })

    if (sameUser.user.length > 0) {
      res.status(400).json({ "message": "user exists with username or email" });
      console.log(sameUser);
      return;
    }

    const result = await gqlSdk.CreateUser({ username: username, email: email, name: name, password_hash: hashed_pwd });

    const newUserId = result.insert_user_one?.id; // The ID of the newly inserted user
    if (!newUserId) {
      res.status(500).json({ "message": "could not be registered" });
    }

    res.status(200).json({
      "message": "Registration successful",
      "userId": newUserId
    });

    return;
  }
  catch (err) {
    res.status(500).json({ "error": err });
    return;
  }

}
