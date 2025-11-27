import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/config.ts";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(' ')[1];
  if (!token) {
    res.status(401).json({ "message": "authorization token not provided" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ "message": "verification failed." });
      return;
    }

    (req as any).user = decoded;

    next();
  });

  return;
}
