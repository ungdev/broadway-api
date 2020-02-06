import { Request, Response } from 'express';
import { unauthenticated, success } from '../../utils/responses';
import generateToken from '../../utils/generateToken';
import User from '../../models/user';
import { Error } from '../../types';
import errorHandler from '../../utils/errorHandler';

export default () => async (req: Request, res: Response) => {
  try {
    const { pin } = req.body;

    const users = await User.findAll();

    let user: User = null;
    if (!user) {
      return unauthenticated(res, Error.INVALID_PIN);
    }

    return success(res, {
      //token: generateToken(user.name, user.key, user.permissions),
      //name: user.name,
      //key: user.key,
    });
  } catch (err) {
    return errorHandler(res, err);
  }
};
