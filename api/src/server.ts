import express from "express";
import http from "http";

import handleLogging from "./middleware/LoggingRequests.ts";
import { displayLog } from "./middleware/LoggingRequests.ts";
import CORSHandler from "./middleware/CORSHandler.ts";
import { SERVER, PG, HASURA } from "./config/config.ts";
import { displayPartsToString } from "typescript";
import { connectDB, handleDatabaseError } from "./db/connection.ts";
import { registrationController } from "./controllers/registrationController.ts";
import { loginController } from "./controllers/loginController.ts";

export const app = express();
export let HTTPServer: ReturnType<typeof http.createServer>;

export const main = async () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json())

  app.use(handleLogging);

  app.use(CORSHandler);

  const client = await connectDB(PG);
  if (!client) {
    displayLog("DB Connection Failed", "WAR");
    return new Promise<null>((res, rej) => res());
  }
  client.on("error", handleDatabaseError);
  displayLog("DB Connection Successful", "LOG");


  app.get("/", async (req, res) => {
    let answer = await client.query("SELECT NOW()");
    res.status(200).json({ "running": "true", "now():": answer });
  });

  app.post("/user/register/", registrationController);

  app.post("/user/login/", loginController);

  HTTPServer = http.createServer(app);
  HTTPServer.listen(SERVER.PORT, () => {
    displayLog("Server started at: " + SERVER.PORT, "LOG");
  });
};

main()
  .catch((err: Error) => {
    displayLog(err.name, "ERR");
  });
