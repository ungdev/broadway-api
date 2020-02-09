import { Request, Response, NextFunction } from 'express';
import { notAcceptable } from '../utils/responses';

export default () => (req: Request, res: Response, next: NextFunction) => {
  if (req.is('application/json')) {
    return next();
  }

  return notAcceptable(res);
};
