import { Response } from 'express';
import { check, body } from 'express-validator';
import { Basket } from '@ung/node-etupay';
import { unauthorized, success, badRequest } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { BodyRequest, Representation, Error } from '../../types';
import Order from '../../models/order';
import { isFull } from '../../utils/users';
import { deleteExpiredOrders } from '../../utils/orders';
import removeAccents from '../../utils/removeAccents';
import validateBody from '../../middlewares/validateBody';
import log from '../../utils/log';

export const createValidation = [
  check('firstname').isAlpha(),
  check('lastname').isAlpha(),
  check('email').isEmail(),
  check('representation').isIn([Representation.Friday, Representation.Saturday]),
  check('users').isArray(),
  check('users.*.firstname').isAlpha(),
  check('users.*.lastname').isAlpha(),
  check('users.*.itemId').isInt(),
  validateBody(),
];

const create = async (req: BodyRequest<Order>, res: Response) => {
  try {
    if (req.body.users.length === 0) {
      log.warn('Invalid form: users length is 0');
      return badRequest(res, Error.INVALID_FORM);
    }

    if (await isFull(req.body.representation, req.body.users.length)) {
      return unauthorized(res, Error.REPRESENTATION_FULL);
    }

    await deleteExpiredOrders();

    const order = await Order.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      representation: req.body.representation,
      users: req.body.users.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        itemId: user.itemId,
      })),
    });

    const data = JSON.stringify({ orderId: order.id });
    const encoded = Buffer.from(data).toString('base64');

    const basket = new Basket(
      'Broadway UTT',
      removeAccents(order.firstname),
      removeAccents(order.lastname),
      order.email,
      'checkout',
      encoded,
    );

    order.users.forEach((user) =>
      basket.addItem(`${user.firstname} ${user.lastname} - ${user.item.title}`, user.item.price, 1),
    );

    return success(res, { url: basket.compute() });
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default create;
