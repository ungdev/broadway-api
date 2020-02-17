import { Response } from 'express';
import { Op, fn } from 'sequelize';
import Order from '../models/order';
import { expirationOrder } from './env';
import { BodyRequest } from '../types';
import { checkItemIdAvailibility } from './items';
import { checkUsersLength, checkIfFull } from './users';
import User from '../models/user';
import Item from '../models/item';

// We suppose that the validation has already be donr
export const create = () => {};

export const getAllOrders = async () => {
  const orders = await Order.findAll();

  return orders;
};

export const deleteExpiredOrders = async () => {
  const date = new Date();
  const dateBefore = new Date();
  dateBefore.setMinutes(date.getMinutes() - expirationOrder());
  await Order.destroy({
    where: {
      updatedAt: {
        [Op.lt]: dateBefore,
      },
      transactionState: 'draft',
    },
  });
};

export const createOrder = async (req: BodyRequest<Order>, res: Response, items: Array<Item>, forcePay = false) => {
  checkUsersLength(req, res);
  checkItemIdAvailibility(req, res, items);
  await checkIfFull(req, res, req.body.representation, req.body.users.length);

  await deleteExpiredOrders();

  const transactionState = forcePay ? 'paid' : 'draft';
  const paidAt = forcePay ? (fn('NOW') as unknown) : null;

  const order = await Order.create(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      representation: req.body.representation,
      transactionState,
      paidAt,
      forcePay,
      users: req.body.users.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        itemId: user.itemId,
      })),
    },
    {
      include: [User],
    },
  );

  return order;
};
