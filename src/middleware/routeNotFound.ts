import type { Request, Response, NextFunction } from 'express';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {

  //here
  const error = new Error("Route Not Found");
  console.log('===================================');
  console.log(error);
  console.log('===================================');

  res.status(400).json({ "error": error.message });

  return

}
