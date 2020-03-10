import User from '../models/user';
import { maxPlaces } from './env';
import Order from '../models/order';

export const getUser = async (id: string) => {
  const user = await User.findByPk(id);

  return user;
};

export const isFull = async (representation: number, places = 0) => {
  const orders = await Order.findAll({
    include: [User],
    where: {
      representation,
    },
  });

  const count = orders.reduce((acc, curr) => {
    return acc + curr.users.length;
  }, 0);

  if (count + places > maxPlaces()) {
    return true;
  }
  return false;
};
