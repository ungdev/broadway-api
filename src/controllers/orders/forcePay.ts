import { Response } from 'express';
import { createOrder, getOrderWithUsersAndItems } from '../../utils/orders';
import { getAllItems } from '../../utils/items';
import { noContent } from '../../utils/responses';
import { BodyRequest } from '../../types';
import errorHandler from '../../utils/errorHandler';
import Order from '../../models/order';
import { sendConfirmationEmail } from '../../mail';

const forcePay = async (req: BodyRequest<Order>, res: Response) => {
  try {
    const items = await getAllItems();
    let order = await createOrder(req, res, items, true);

    // Not need to return an answer to client, already done in createOrder()
    if (!order) {
      return false;
    }

    // Adds the items in the order
    order = await getOrderWithUsersAndItems(order.id);

    // No need to await because the client doesn't need to wait to send the confirmation
    sendConfirmationEmail(order);

    return noContent(res);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export default forcePay;
