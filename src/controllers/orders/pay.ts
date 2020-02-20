import { Response } from 'express';
import fs from 'fs';
import { check } from 'express-validator';
import etupay from '../../utils/etupay';
import { success, unauthorized } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { BodyRequest, Error } from '../../types';
import Order from '../../models/order';
import { createOrder } from '../../utils/orders';
import removeAccents from '../../utils/removeAccents';
import validateBody from '../../middlewares/validateBody';
import { getAllItems } from '../../utils/items';
import { integer } from '../../utils/validators';
import { representationCount, paymentEnabled } from '../../utils/env';
import { generateTicket } from '../../mail';
import Item from '../../models/item';

export const createValidation = [
  check('firstname').isString(),
  check('lastname').isString(),
  check('email').isEmail(),
  check('representation').isInt({ min: 0, max: representationCount() - 1 }),
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
const pay = async (req: BodyRequest<Order>, res: Response) => {
  try {
    if (!paymentEnabled()) {
      return unauthorized(res, Error.PAYMENT_DISABLED);
    }

    const items = await getAllItems();
    const order = await createOrder(req, res, items);

    // Not need to return an answer to client, already done in createOrder()
    if (!order) {
      return false;
    }

    const data = JSON.stringify({ orderId: order.id });
    const encoded = Buffer.from(data).toString('base64');

    const basket = new (etupay().Basket)(
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

    // ***** TEST ***** //
    const user1 = order.users[0];

    user1.item = await Item.findByPk(user1.itemId);

    const pdf = await generateTicket(user1, order.representation);

    fs.writeFileSync('test.pdf', pdf);
    // ***** END TEST ***** //

    return success(res, { url: basket.compute() });
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default pay;
