import type { Request, Response, NextFunction } from "express";
import { gqlSdk } from "../config/graphqlClient.ts";

export async function resumeUploadController(req: Request, res: Response, next: NextFunction): Promise<void> {

  console.log(req.file);
  try {

    if (!req.file) {
      res.status(400).json({ "message": "no file provided." });
      return;
    }

    const userId = Number((req as any).user.sub);

    const result = await gqlSdk.InsertResume({ user_id: userId, filepath: req.file.path });

    const resumeId = result.insert_resume_one?.id;
    if (!resumeId) {
      res.status(500).json({ "message": "could not upload resume" });
    }

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
