import { Router } from 'express';
import login from './login';

export default () => {
  const router = Router();

  router.post('/login', login());

  return router;
};
