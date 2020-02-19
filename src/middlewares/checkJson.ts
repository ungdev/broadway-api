import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { badRequest } from '../utils/responses';
import log from '../utils/log';

export const checkJson = () => (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError) {
    log.error('Invalid syntax');
    return badRequest(res);
  }

  return next();
};
