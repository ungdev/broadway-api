import { Router } from 'express';
import hasPermission from '../../middlewares/hasPermission';
import { Permissions } from '../../types';
import scan from './scan';

export default () => {
  const router = Router();

  router.patch('/:id', hasPermission(Permissions.Orga), scan);

  return router;
};
