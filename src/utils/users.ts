import User from '../models/user';
import { maxPlaces } from './env';
import { Representation } from '../types';
import Order from '../models/order';

export const isFull = async (representation: Representation, places = 0) => {
  const count = await User.count({
    include: [
      {
        model: Order,
        attributes: [],
        where: {
          representation,
        },
      },
    ],
  });

  return count + places > maxPlaces;
};
