import { Router } from 'express';
import auth from './auth';
import items from './items';
import orders from './orders';
import users from './users';
import etupay from './etupay';

const routes = () => {
  const router = Router();

  router.use('/auth', auth());
  router.use('/items', items());
  router.use('/orders', orders());
  router.use('/users', users());
  router.use('/etupay', etupay());

  return router;
};

export default routes;
