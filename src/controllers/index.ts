import { Router } from 'express';
import auth from './auth';
import items from './items';
import orders from './orders';
import users from './users';

const routes = () => {
  const router = Router();

  router.use('/auth', auth());
  router.use('/items', items());
  router.use('/orders', orders());
  router.use('/users', users());

  return router;
};

export default routes;
