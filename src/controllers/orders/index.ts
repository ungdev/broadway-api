import { Router } from 'express';
import { etupayCallback, successfulPayment } from './etupayCallback';
import pay, { createValidation } from './pay';
import etupay from '../../utils/etupay';

export default () => {
  const router = Router();

  router.post('/', createValidation, pay);

  router.get('/return', etupay().middleware, successfulPayment);
  router.post('/callback', etupayCallback);

  return router;
};
