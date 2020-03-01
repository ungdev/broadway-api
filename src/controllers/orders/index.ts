import { Router } from 'express';
import pay, { createValidation } from './pay';
import hasPermission from '../../middlewares/hasPermission';
import { Permissions } from '../../types';
import list from './list';
import forcePay from './forcePay';
import get from './get';
import forgotten, { forgottenValidation } from './forgotten';

export default () => {
  const router = Router();

  router.get('/', hasPermission(Permissions.Admin), list);
  router.get('/:id', hasPermission(Permissions.Orga), get);

  router.post('/', createValidation, pay);
  router.post('/resendEmail', forgottenValidation, forgotten);
  router.post('/forcePay', hasPermission(Permissions.Admin), createValidation, forcePay);

  return router;
};
