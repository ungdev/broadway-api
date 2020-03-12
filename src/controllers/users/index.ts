import { Router } from 'express';
import hasPermission from '../../middlewares/hasPermission';
import { Permissions } from '../../types';
import scan from './scan';
import email from './email';

export default () => {
  const router = Router();

  router.patch('/:id', hasPermission(Permissions.Orga), scan);
  router.post('/email', hasPermission(Permissions.Admin), email);

  return router;
};
