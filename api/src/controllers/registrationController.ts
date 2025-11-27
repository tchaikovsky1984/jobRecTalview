import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import type { RegisterRequestBody } from "../config/types.ts"
import { getDBClient } from "../db/connection.ts";

export async function registrationController(req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> {

  const { username, email, name, password } = req.body;
  const saltRounds: number = 10;

  try {
    const hashed_pwd: string = await bcrypt.hash(password, saltRounds);

    const client = getDBClient();
    if (client instanceof Error) {
      res.status(500).json({ "message": "couldnt get DB" });
      return;
    }

    const sameUser = await client.query("SELECT * FROM \"user\" WHERE username = $1 OR email = $2", [username, email]);

    if (sameUser.rows.length > 0) {
      res.status(400).json({ "message": "user exists with username or email" });
      return;
    }

    const insertUserQuery = `
            INSERT INTO "user" (username, email, name, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id; 
            `;

    const result = await client.query(insertUserQuery, [username, email, name, hashed_pwd]);

    const newUserId = result.rows[0].id; // The ID of the newly inserted user

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
