import { Router } from 'express';
import { etupayCallback, successfulPayment } from './etupayCallback';
import pay, { createValidation } from './pay';
import etupay from '../../utils/etupay';
import hasPermission from '../../middlewares/hasPermission';
import { Permissions } from '../../types';
import list from './list';
import forcePay from './forcePay';
import get from './get';
import log from '../../utils/log';

export default () => {
  const router = Router();

  router.get('/', hasPermission(Permissions.Admin), list);
  router.get('/:id', hasPermission(Permissions.Orga), get);

  router.post('/', createValidation, pay);
  router.post('/forcePay', hasPermission(Permissions.Admin), createValidation, forcePay);

  try {
    router.get('/return', etupay().middleware, successfulPayment);
    router.post('/callback', etupayCallback);
  } catch (err) {
    log.warn('Etupay credentials not precised');
  }

  return router;
};
