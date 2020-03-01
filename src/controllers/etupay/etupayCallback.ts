import { Request, Response } from 'express';
import { fn } from 'sequelize';
import errorHandler from '../../utils/errorHandler';
import { successUrl, errorUrl } from '../../utils/env';
import { sendConfirmationEmail } from '../../mail';
import { getOrderWithUsersAndItems } from '../../utils/orders';

export const etupayCallback = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'ok' })
    .end();
};

const errorRedirect = (res: Response, error: string) => {
  return res.redirect(`${errorUrl()}&error=${error}`);
};

/**
 * Possible redirections
 *
 * Error parameters:
 * NO_PAYLOAD
 * NOT_FOUND
 * ALREADY_PAID
 * ALREADY_ERRORED
 * TRANSACTION_ERROR
 */

export const successfulPayment = async (req: Request, res: Response) => {
  try {
    if (!req.query.payload) {
      return errorRedirect(res, 'NO_PAYLOAD');
    }

    const { orderId } = JSON.parse(Buffer.from(req.etupay.serviceData, 'base64').toString());

    const order = await getOrderWithUsersAndItems(orderId);

    if (!order) {
      return errorRedirect(res, 'NOT_FOUND');
    }

    if (order.transactionState === 'paid') {
      return errorRedirect(res, 'ALREADY_PAID');
    }

    if (order.transactionState !== 'draft') {
      return errorRedirect(res, 'ALREADY_ERRORED');
    }

    order.transactionId = req.etupay.transactionId;
    order.transactionState = req.etupay.step;

    if (order.transactionState !== 'paid') {
      await order.save();
      return res.redirect(`${errorUrl()}&error=TRANSACTION_ERROR`);
    }

    order.paidAt = (fn('NOW') as unknown) as Date;
    await order.save();

    res.redirect(successUrl());

    await sendConfirmationEmail(order);

    return res.end();
  } catch (err) {
    return errorHandler(res, err);
  }
};
