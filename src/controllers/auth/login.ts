import { Request, Response } from 'express';
import { success } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';

export default () => async (req: Request, res: Response) => {
  try {
    return success(res, {});
  } catch (err) {
    return errorHandler(res, err);
  }
};
