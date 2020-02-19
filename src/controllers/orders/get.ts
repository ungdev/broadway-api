import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import { getOrderWithUsers } from '../../utils/orders';
import { success, notFound, unauthorized } from '../../utils/responses';
import { Error } from '../../types';

const get = async (req: Request, res: Response) => {
  try {
    const order = await getOrderWithUsers(req.params.id);

    if (!order) {
      return notFound(res, Error.ORDER_NOT_FOUND);
    }

    if (order.transactionState !== 'paid') {
      return unauthorized(res, Error.NOT_PAID);
    }

    return success(res, order);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default get;
