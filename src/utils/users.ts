import { Request, Response } from 'express';
import User from '../models/user';
import { maxPlaces } from './env';
import { Error } from '../types';
import Order from '../models/order';
import log from './log';
import { badRequest, unauthorized } from './responses';

export const checkIfFull = async (req: Request, res: Response, representation: number, places = 0) => {
  const count = await User.count({
    include: [
      {
        model: Order,
        attributes: [],
        where: {
          representation,
        },
      },
    ],
  });

  if (count + places > maxPlaces()) {
    return unauthorized(res, Error.REPRESENTATION_FULL);
  }

  return true;
};

export const checkUsersLength = (req: Request, res: Response) => {
  if (req.body.users.length === 0) {
    log.warn('Invalid form: users length is 0');
    return badRequest(res, Error.INVALID_FORM);
  }

  return true;
};
