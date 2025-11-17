import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { gql } from "graphql-request";

import type { RegisterRequestBody } from "../config/types.ts"
import { persistentGraphQLClient } from "../db/connection.ts";

export async function registrationController(req: Request<{}, {}, RegisterRequestBody>, res: Response)
  : Promise<void> {

  const { username, email, name, role, password } = req.body;
  const saltRounds: number = 10;

  try {
    const hashed_pwd: string = await bcrypt.hash(password, saltRounds);

    const query = gql`query findUser{
      User(where: {username: {_eq: $username }, email: {_eq: $email}}){
      name
      username
      email
      createdAt}
    }`;

    let variables = { username: username, email: email };

    const result = await persistentGraphQLClient.request(query, variables);

    res.status(200).json({ "result": result });

    return;
  }
  catch (err) {
    res.status(500).json({ "error": err });
    return;
  }

}
