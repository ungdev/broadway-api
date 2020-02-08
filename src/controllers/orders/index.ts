import { Router } from 'express';
import create, { createValidation } from './create';

export default () => {
  const router = Router();

  router.post('/', createValidation, create);

  return router;
};
