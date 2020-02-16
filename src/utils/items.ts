import { Request, Response } from 'express';
import Item from '../models/item';
import { badRequest } from './responses';
import log from './log';
import { Error } from '../types';

export const getAllItems = async (raw = true) => {
  return Item.findAll({
    attributes: ['id', 'name', 'description', 'price'],
    raw,
  });
};

export const checkItemIdAvailibility = (req: Request, res: Response, items: Array<Item>) => {
  for (let i = 0; i < req.body.users.length; i += 1) {
    if (!items.some((item) => item.id === req.body.users[i].itemId)) {
      log.warn('Invalid form: bad itemId');
      return badRequest(res, Error.INVALID_FORM);
    }
  }

  return true;
};
