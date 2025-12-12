import type { Request, Response, NextFunction } from "express";

import { displayLog } from "./logger.ts";

export default function handleLogging(req: Request, res: Response, next: NextFunction): void {

  let text: string = `Incoming: \n\t${req.method}\n\t${req.url}\n\t${req?.socket?.remoteAddress}`
  displayLog(text, "LOG");

  res.on("finish", () => {
    text = `Outgoing: \n\t${res.statusCode}\n\t${req.method}\n\t${req.url}\n\t${req?.socket?.remoteAddress}`;
    displayLog(text, "LOG");
  });

  next();

};

