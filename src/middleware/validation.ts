import type { Request, Response, NextFunction } from "express";

import type { RegisterRequestBody, Role } from "../config/types.ts"

export function validateregisterdata(req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction): void {

  const { username, email, name, role, password } = req.body;

  let emailregex: RegExp = new RegExp("^[A-Za-z0-9._%+-]+@[a-za-z0-9.-]+\.[a-za-z]{2,}$");

  const invalid: boolean =
    !username ||
    !email ||
    !name ||
    !role ||
    !password ||
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof name !== "string" ||
    !isRole(role) ||
    typeof password !== "string" ||
    !emailregex.test(email);

  if (invalid) {
    res.status(400).json({ "message": "wrong schema provided" });
    return;
  }

  next();
};

function isRole(s: string): s is Role {
  return (s === "admin" || s === "user");
}
