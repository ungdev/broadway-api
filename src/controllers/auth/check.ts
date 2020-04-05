import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import getToken from '../../utils/getToken';
import { tokenSecret } from '../../utils/env';
import { unauthenticated, noContent } from '../../utils/responses';
import { Error } from '../../types';

export default () => (req: Request, res: Response) => {
  const token = getToken(req);

  if (token) {
    try {
      jwt.verify(token, tokenSecret());
    } catch (err) {
      return unauthenticated(res, Error.INVALID_TOKEN);
    }

    return noContent(res);
  }

  return unauthenticated(res);
};
