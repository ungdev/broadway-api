import { Request, Response } from 'express';
import { getUser } from '../../utils/users';
import { notFound, unauthorized, noContent } from '../../utils/responses';
import { Error } from '../../types';

/**
 * Request:
 * id: (user id)
 *
 * Response 200, 403, 404
 */
const scan = async (req: Request, res: Response) => {
  const user = await getUser(req.params.id);

  if (!user) {
    return notFound(res, Error.USER_NOT_FOUND);
  }

  if (user.isScanned) {
    return unauthorized(res, Error.USER_ALREADY_SCANNED);
  }

  user.isScanned = true;
  await user.save();

  return noContent(res);
};

export default scan;
