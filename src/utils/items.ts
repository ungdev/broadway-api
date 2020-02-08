import Item from '../models/item';

export const getAllItems = () => {
  return Item.findAll({
    attributes: ['title', 'description', 'price'],
  });
};

export const getAvailableIds = () => {
  return Item.findAll({
    attributes: ['id'],
  });
};
