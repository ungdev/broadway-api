import Item from '../src/models/item';

const seedItems = () => {
  let items = [
    {
      id: 1,
      name: 'Plein tarif',
      description: '',
      price: 1400,
    },
    {
      id: 2,
      name: 'Tarif moins de 18 ans ou étudiant',
      description: '',
      price: 1000,
    },
    {
      id: 3,
      name: 'Tarif moins de 12 ans ou cotisant BDE UTT',
      description: '',
      price: 800,
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
