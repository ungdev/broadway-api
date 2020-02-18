import Item from '../models/item';
import User from '../models/user';

export const getAllItems = async (raw = true) => {
  return Item.findAll({
    attributes: ['id', 'name', 'description', 'price'],
    raw,
  });
};

export const isItemIdValid = (users: Array<User>, items: Array<Item>) => {
  for (let i = 0; i < users.length; i += 1) {
    if (!items.some((item) => item.id === users[i].itemId)) {
      return false;
    }
  }

  return true;
};
