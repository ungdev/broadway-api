import jwt from 'jsonwebtoken';

const generateToken = (name: string, key: string) =>
  jwt.sign({ name, key }, process.env.APP_TOKEN_SECRET, {
    expiresIn: process.env.APP_TOKEN_EXPIRES,
  });

export default generateToken;
