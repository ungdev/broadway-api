import { Response } from 'express';
import { createOrder } from '../../utils/orders';
import { getAllItems } from '../../utils/items';
import { success } from '../../utils/responses';
import { BodyRequest } from '../../types';
import errorHandler from '../../utils/errorHandler';
import Order from '../../models/order';

const forcePay = async (req: BodyRequest<Order>, res: Response) => {
  try {
    const items = await getAllItems();
    const order = await createOrder(req, res, items, true);

    // Not need to return an answer to client, already done in createOrder()
    if (!order) {
      return false;
    }

    return success(res, order);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default forcePay;
