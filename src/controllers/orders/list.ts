import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import { getAllOrders } from '../../utils/orders';
import { success } from '../../utils/responses';

const list = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();

    return success(res, orders);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default list;
