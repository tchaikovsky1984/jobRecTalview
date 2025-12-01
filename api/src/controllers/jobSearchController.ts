import type { Request, Response, NextFunction } from "express";

import { getDBClient } from "../db/connection.ts";

export async function jobSearchController(req: Request, res: Response, next: NextFunction): Promise<void> {
}
