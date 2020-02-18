import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import { getOrderWithUsers } from '../../utils/orders';
import { success } from '../../utils/responses';

const get = async (req: Request, res: Response) => {
  try {
    const order = await getOrderWithUsers(req.params.id);

    return success(res, order);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default get;
