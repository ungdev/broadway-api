import { Router } from 'express';
import login from './login';
import check from './check';

export default () => {
  const router = Router();

  router.post('/login', login());
  router.get('/check', check());

  return router;
};
