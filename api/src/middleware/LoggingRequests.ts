import type { Request, Response, NextFunction } from "express";

import type { LogType } from "../config/types.ts";

export default function handleLogging(req: Request, res: Response, next: NextFunction): void {

  let text: string = `Incoming: \n\t${req.method}\n\t${req.url}\n\t${req.socket.remoteAddress}`
  displayLog(text, "LOG");

  res.on("finish", () => {
    text = `Outgoing: \n\t${res.statusCode}\n\t${req.method}\n\t${req.url}\n\t${req.socket.remoteAddress}`;
    displayLog(text, "LOG");
  });

  next();

};

export function displayLog(text: string, ty: LogType): void {
  console.log("-------------------------------------");
  console.log(ty + "|| : \n" + text);
  console.log("-------------------------------------");
};
