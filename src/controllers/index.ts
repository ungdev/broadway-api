import { Router } from 'express';
import auth from './auth';
import items from './items';
import orders from './orders';

const routes = () => {
  const router = Router();

  router.use('/auth', auth());
  router.use('/items', items());
  router.use('/orders', orders());

  return router;
};

export default routes;
