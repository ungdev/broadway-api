import { CustomValidator } from 'express-validator';

export const integer: CustomValidator = (value) => typeof value === 'number';
