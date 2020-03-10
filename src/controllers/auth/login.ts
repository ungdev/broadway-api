import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { success, unauthenticated } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { adminPassword, orgaPassword, tokenSecret, tokenExpires as tokenExpiresIn } from '../../utils/env';
import { Permissions, Error } from '../../types';

/**
 * Request body: { password }
 * Response: { token, permissions }
 */
export default () => async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    let permissions: Permissions;

    switch (password) {
      case adminPassword():
        permissions = Permissions.Admin;
        break;

      case orgaPassword():
        permissions = Permissions.Orga;
        break;

      default:
        return unauthenticated(res, Error.INVALID_PASSWORD);
    }

    const token = jwt.sign({ permissions }, tokenSecret(), {
      expiresIn: tokenExpiresIn(),
    });

    return success(res, {
      token,
      permissions,
    });
  } catch (err) {
    return errorHandler(res, err);
  }
};
