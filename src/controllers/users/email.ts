import { check } from 'express-validator';
import { Request, Response } from 'express';
import { sendEmail } from '../../mail';
import { noContent } from '../../utils/responses';
import { getAllPaidOrders } from '../../utils/orders';
import log from '../../utils/log';

export const checkEmail = [check('title').isString(), check('content').isString()];

/**
 * Request :
 *  title: string
 *  content: string
 *
 * Response :
 *  204 No Content
 */
const email = async (req: Request, res: Response) => {
  const orders = await getAllPaidOrders();

  orders.forEach((order) => {
    log.info(`sending an email to ${order.email}...`);

    // We don't have to wait for the emails to be sent
    sendEmail(order.email, {
      title: req.body.title,
      content: req.body.content,
    });
  });

  return noContent(res);
};

export default email;
