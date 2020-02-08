import { Op } from 'sequelize';
import { check } from 'express-validator';
import { Representation, BodyRequest } from '../types';
import errorHandler from './errorHandler';
import Order from '../models/order';
import { expirationOrder } from './env';

// We suppose that the validation has already be donr
export const create = (request: BodyRequest<Order>, res: Response) => {};

export const deleteExpiredOrders = async () => {
  const date = new Date();
  const dateBefore = new Date();
  dateBefore.setMinutes(date.getMinutes() - expirationOrder);
  await Order.destroy({
    where: {
      updatedAt: {
        [Op.lt]: dateBefore,
      },
      transactionState: 'draft',
    },
  });
};
