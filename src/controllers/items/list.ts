import { Request, Response } from 'express';
import { success } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { getAllItems } from '../../utils/items';
import { paymentEnabled } from '../../utils/env';

/**
 * Request body: {}
 * Reponse: { items[], paymentEnabled }
 */
export default async (req: Request, res: Response) => {
  try {
    const items = await getAllItems();

    return success(res, {
      items,
      paymentEnabled: paymentEnabled(),
    });
  } catch (err) {
    return errorHandler(res, err);
  }
};
