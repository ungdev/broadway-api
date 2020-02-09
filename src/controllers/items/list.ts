import { Request, Response } from 'express';
import { success } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { getAllItems } from '../../utils/items';

/**
 * Request body: {}
 * Reponse: items[]
 */
export default async (req: Request, res: Response) => {
  try {
    const items = getAllItems();

    return success(res, items);
  } catch (err) {
    return errorHandler(res, err);
  }
};
