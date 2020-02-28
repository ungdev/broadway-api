import { Request, Response } from 'express';
import { fn } from 'sequelize';
import errorHandler from '../../utils/errorHandler';
import { successUrl } from '../../utils/env';
import Order from '../../models/order';
import User from '../../models/user';

export const etupayCallback = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'ok' })
    .end();
};

/**
 * Possible redirections
 *
 * Error parameters:
 * NO_PAYLOAD
 * CART_NOT_FOUND
 * TRANSACTION_ERROR
 */

export const successfulPayment = async (req: Request, res: Response) => {
  try {
    if (!req.query.payload) {
      return res.redirect(`${successUrl()}&error=NO_PAYLOAD`);
    }

    const { orderId } = JSON.parse(Buffer.from(req.etupay.serviceData, 'base64').toString());

    const order = await Order.findOne({
      where: {
        id: orderId,
        transactionState: 'draft',
      },
      include: [User],
    });

    if (!order) {
      return res.redirect(`${successUrl()}&error=CART_NOT_FOUND`);
    }

    order.transactionId = req.etupay.transactionId;
    order.transactionState = req.etupay.step;

    if (order.transactionState !== 'paid') {
      await order.save();
      return res.redirect(`${process.env.ARENA_ETUPAY_ERRORURL}&error=TRANSACTION_ERROR`);
    }

    order.paidAt = (fn('NOW') as unknown) as Date;
    await order.save();

    res.redirect(successUrl());

    return res.end();
  } catch (err) {
    return errorHandler(res, err);
  }
};
