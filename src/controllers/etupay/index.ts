import { Router } from 'express';
import { etupayCallback, successfulPayment } from './etupayCallback';
import etupay from '../../utils/etupay';
import log from '../../utils/log';

export default () => {
  const router = Router();

  try {
    router.get('/return', etupay().middleware, successfulPayment);
    router.post('/callback', etupayCallback);
  } catch (err) {
    log.warn('Etupay credentials not precised');
  }

  return router;
};
