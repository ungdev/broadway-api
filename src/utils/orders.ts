import { Op } from 'sequelize';
import Order from '../models/order';
import { orderExpiration } from './env';

// We suppose that the validation has already be done
export const create = () => {};

export const deleteExpiredOrders = async () => {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() - orderExpiration());

  await Order.destroy({
    where: {
      updatedAt: {
        [Op.lt]: expirationDate,
      },
      transactionState: 'draft',
    },
  });
};
