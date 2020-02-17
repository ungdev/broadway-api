import { Response } from 'express';
import { check } from 'express-validator';
import etupay from '../../utils/etupay';
import { success } from '../../utils/responses';
import errorHandler from '../../utils/errorHandler';
import { BodyRequest, Representation } from '../../types';
import Order from '../../models/order';
import { checkUsersLength, checkIfFull } from '../../utils/users';
import { deleteExpiredOrders } from '../../utils/orders';
import removeAccents from '../../utils/removeAccents';
import validateBody from '../../middlewares/validateBody';
import User from '../../models/user';
import { getAllItems, checkItemIdAvailibility } from '../../utils/items';
import { integer } from '../../utils/validators';

export const createValidation = [
  check('firstname').isAlpha(),
  check('lastname').isAlpha(),
  check('email').isEmail(),
  check('representation').isIn([Representation.Friday, Representation.Saturday]),
  check('users').isArray(),
  check('users.*.firstname').isAlpha(),
  check('users.*.lastname').isAlpha(),
  check('users.*.itemId').custom(integer),
  validateBody(),
];

/**
 * Request body: { order(firstname, lastname, representation, email, users(firstname, lastname, ticketId) }
 * Response { url }
 */
const create = async (req: BodyRequest<Order>, res: Response) => {
  try {
    const items = await getAllItems();

    checkUsersLength(req, res);
    checkItemIdAvailibility(req, res, items);
    await checkIfFull(req, res, req.body.representation, req.body.users.length);

    await deleteExpiredOrders();

    const order = await Order.create(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        representation: req.body.representation,
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
      basket.addItem(`${user.firstname} ${user.lastname} - ${item.name}`, item.price, 1);
    });

    return success(res, { url: basket.compute() });
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default create;
