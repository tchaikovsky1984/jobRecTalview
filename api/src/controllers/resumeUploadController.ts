import type { Request, Response } from "express";
import { gqlSdk } from "../config/graphqlClient.ts";

export async function resumeUploadController(req: Request, res: Response): Promise<void> {

  console.log(req.file);
  try {

    if (!req.file) {
      res.status(400).json({ "message": "no file provided." });
      return;
    }

    const userId = Number((req as any).user.sub);
    if (!userId) {
      res.status(400).json({ "message": "user not provided" });
      return;
    }

    const result = await gqlSdk.InsertResume({ user_id: userId, filepath: req.file.path });

    const resumeId = result.insert_resume_one?.id;
    if (!resumeId) {
      res.status(500).json({ "message": "could not upload resume" });
      return;
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
      "detail": (e as Error).message
    });
    return;
  }
};
