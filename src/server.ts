import express from 'express';
import http from "http";

import { LoggingHandler } from "./middleware/LoggingHandler.ts";
import { CORSHandler } from "./middleware/CORSHandler.ts";
import { routeNotFound } from "./middleware/routeNotFound.ts";
import { SERVER } from "./config/config.ts";
import { DB } from "./config/config.ts";
import { Client } from "pg";
import { connectDB, handleDatabaseError } from "./db/connection.ts";

export const app = express();
export let HTTPServer: ReturnType<typeof http.createServer>;

export const main = async () => {
  console.info("-----------");
  console.info("Init API");
  console.info("-----------");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  console.info("-----------");
  console.info("Logging & Config");
  console.info("-----------");

  app.use(LoggingHandler);

  console.info("-----------");
  console.info("CORS Protocol");
  console.info("-----------");

  app.use(CORSHandler);

  console.info("-----------");
  console.info("Define Routing");
  console.info("-----------");

  const client = await connectDB(DB);
  if (!client) {
    console.info("-----------");
    console.info("DB Connection Failed");
    console.info("-----------");
    return new Promise<null>((res, rej) => rej());
  }
  client.on("error", handleDatabaseError);
  console.info("-----------");
  console.info("DB Connection Succesful");
  console.info("-----------");

  app.get("/main/healthcheck", async (req, res) => {
    const answer = await client.query("SELECT NOW()");
    res.status(200).json({ "running": "true", "now()": answer });
  });

  app.use(routeNotFound);

  HTTPServer = http.createServer(app);
  HTTPServer.listen(SERVER.PORT, () => {
    console.info("-----------");
    console.info("Server Started at " + SERVER.HOSTNAME + ":" + SERVER.PORT);
    console.info("-----------");
  });
};

main()
  .catch((err: Error) => {
    console.log('===================================');
    console.log("err: " + err);
    console.log('===================================');
  });

