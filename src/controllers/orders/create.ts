import { Response } from 'express';
import { check } from 'express-validator';
import etupay from '../../utils/etupay';
import { success } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { BodyRequest } from '../../types';
import Order from '../../models/order';
import { createOrder } from '../../utils/orders';
import removeAccents from '../../utils/removeAccents';
import validateBody from '../../middlewares/validateBody';
import { getAllItems } from '../../utils/items';
import { integer } from '../../utils/validators';

export const createValidation = [
  check('firstname').isString(),
  check('lastname').isString(),
  check('email').isEmail(),
  check('representation').isNumeric(),
  check('users').isArray(),
  check('users.*.firstname').isString(),
  check('users.*.lastname').isString(),
  check('users.*.itemId').custom(integer),
  validateBody(),
];

/**
 * Request body: { firstname, lastname, email, representation, users(firstname, lastname, ticketId) }
 * Response { url }
 */
const create = async (req: BodyRequest<Order>, res: Response) => {
  try {
    const items = await getAllItems();
    const order = await createOrder(req, res, items);

    const data = JSON.stringify({ orderId: order.id });
    const encoded = Buffer.from(data).toString('base64');

    const basket = new (etupay()).Basket(
      'Broadway UTT',
      removeAccents(order.firstname),
      removeAccents(order.lastname),
      order.email,
      'checkout',
      encoded,
    );

    order.users.forEach((user) => {
      const item = items.find((item) => item.id === user.itemId);
      basket.addItem(
        `${removeAccents(user.firstname)} ${removeAccents(user.lastname)} - ${removeAccents(item.name)}`,
        item.price,
        1,
      );
    });

    return success(res, { url: basket.compute() });
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default create;
