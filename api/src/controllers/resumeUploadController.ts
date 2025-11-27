import type { Request, Response, NextFunction } from "express";

import { getDBClient } from "../db/connection.ts";

export async function resumeUploadController(req: Request, res: Response, next: NextFunction): Promise<void> {

  console.log(req.file);
  try {

    if (!req.file) {
      res.status(400).json({ "message": "no file provided." });
      return;
    }

    const userId = Number((req as any).user.sub);
    const client = getDBClient();

    if (client instanceof Error) {
      res.status(500).json({
        "message": "could not get DB"
      });
      return;
    }

    const insertQuery = `
                      INSERT INTO "resume" (user_id, filepath)
                      values ($1, $2)
                      RETURNING id
                      `
    const result = await client.query(insertQuery, [userId, req.file.path]);

    const resumeId = result.rows[0].id;

    res.status(200).json({
      "message": "resume uploaded",
      "resumeId": resumeId
    });
    return;
  }

  catch (e) {
    res.status(500).json({
      "message": "error",
      "detail": e
    });
    return;
  }
};
