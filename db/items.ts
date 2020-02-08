import Items from '../src/models/item';
import Item from '../src/models/item';

const seedItems = () => {
  let items = [
    {
      id: 1,
      name: 'Tarif BDE',
      description: 'BLABLABLA',
      price: 800,
    },
    {
      id: 2,
      name: 'Tarif Réduit',
      description: 'BLABLABLA',
      price: 1100,
    },
    {
      id: 3,
      name: 'Tarif Adulte',
      description: 'BLABBLABLALA',
      price: 1500,
    },
  ];

  items = items.map((item) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return Item.bulkCreate(items);
};

export default seedItems;
