import type { Request, Response, NextFunction } from 'express';

export function LoggingHandler(req: Request, res: Response, next: NextFunction) {
  console.log('===================================');
  console.log(`Incoming :\n\tMETHOD: ${req.method}\n\tURL: ${req.url}\n\tIP: ${req.socket.remoteAddress}`);
  console.log('===================================');

  res.on('finish', () => {
    console.log(`Outgoing: \n\tSTATUS: ${res.statusCode}\n\tMETHOD: ${req.method}\n\tURL: ${req.url}\n\tIP: ${req.socket.remoteAddress}`);
  });

  next();

}

