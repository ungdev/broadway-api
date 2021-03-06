import { Response } from 'express';
import { Op, fn } from 'sequelize';
import Order from '../models/order';
import { BodyRequest, Error } from '../types';
import { isItemIdValid } from './items';
import { isFull } from './users';
import User from '../models/user';
import Item from '../models/item';
import { orderExpiration } from './env';
import { badRequest, unauthorized } from './responses';
import log from './log';
import { getIp } from './network';

export const getOrder = async (id: string) => {
  const order = await Order.findByPk(id, {
    include: [User],
  });

  return order;
};

export const getAllOrders = async () => {
  const orders = await Order.findAll();

  return orders;
};

export const getAllPaidOrders = async () => {
  const paidOrders = await Order.findAll({
    where: {
      transactionState: 'paid',
    },
  });

  return paidOrders;
};

export const getOrderWithUsers = async (id: string) => {
  const order = await Order.findByPk(id, {
    include: [User],
  });

  return order;
};

export const getOrderWithUsersAndItems = async (id: string) => {
  const order = await Order.findByPk(id, {
    include: [
      {
        model: User,
        include: [Item],
      },
    ],
  });

  return order;
};

export const getPaidOrdersWithUsersAndItemsFromEmail = async (email: string) => {
  const orders = await Order.findAll({
    where: {
      email,
      transactionState: 'paid',
    },
    include: [
      {
        model: User,
        include: [Item],
      },
    ],
  });

  return orders;
};

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

// Creates an order and returns it with its users
export const createOrder = async (req: BodyRequest<Order>, res: Response, items: Array<Item>, forcePay = false) => {
  if (req.body.users.length === 0) {
    log.warn('Invalid form: users length is 0');
    badRequest(res, Error.INVALID_FORM);
    return false;
  }

  if (!isItemIdValid(req.body.users, items)) {
    log.warn('Invalid form: bad itemId');
    badRequest(res, Error.INVALID_FORM);
    return false;
  }

  if (await isFull(req.body.representation, req.body.users.length)) {
    unauthorized(res, Error.REPRESENTATION_FULL);
    return false;
  }

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
      ip: getIp(req),
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
