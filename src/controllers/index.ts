import { Router } from 'express';
import auth from './auth';

const routes = () => {
  const router = Router();

  router.use('/auth', auth());

  return router;
};

export default routes;
