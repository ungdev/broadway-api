import { Request, Response } from 'express';
import { check } from 'express-validator';
import validateBody from '../../middlewares/validateBody';
import { getPaidOrdersWithUsersAndItemsFromEmail } from '../../utils/orders';
import { notFound, noContent } from '../../utils/responses';
import { sendConfirmationEmail } from '../../mail';
import { Error } from '../../types';

export const forgottenValidation = [check('email').isEmail(), validateBody()];

export default async (req: Request, res: Response) => {
  const orders = await getPaidOrdersWithUsersAndItemsFromEmail(req.body.email);

  if (orders.length === 0) {
    return notFound(res, Error.ORDER_NOT_FOUND);
  }

  // The loop isn't async so that the client doesn't have to wait

  orders.forEach((order) => {
    sendConfirmationEmail(order);
  });
  return noContent(res);
};
