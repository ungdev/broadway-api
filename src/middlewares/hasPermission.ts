import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import getToken from '../utils/getToken';
import { unauthorized, unauthenticated } from '../utils/responses';
import errorHandler from '../utils/errorHandler';
import { Token, Permissions } from '../types';
import { tokenSecret } from '../utils/env';

export default (permissions: Permissions) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req);

    if (token) {
      const decoded = jwt.verify(token, tokenSecret()) as Token;

      req.permissions = decoded.permissions;

      if (decoded.permissions === permissions || decoded.permissions === Permissions.Admin) {
        return next();
      }
      return unauthorized(res);
    }

    return unauthenticated(res);
  } catch (err) {
    return errorHandler(res, err);
  }
};
