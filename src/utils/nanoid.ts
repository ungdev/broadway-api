import generate from 'nanoid/async/generate';

const nanoid = () => {
  return generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 5);
};

export default nanoid;
