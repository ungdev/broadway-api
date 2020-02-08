import { Request } from 'express';
/**
 * DISCLAMER: Dans mode développement, la modification de ce fichier ne sera peut-être pas prise en compte par le serveur de dev
 * Redémarrer le serveur dans ce cas là
 */
// General

export enum Permission {
  Admin = 'admin',
  Orga = 'orga',
}

export interface Token {
  name: string;
  key: string;
  permission: Permission;
}

export enum Representation {
  Friday = 'friday',
  Saturday = 'saturday',
}

export enum Error {
  // 400
  BAD_REQUEST = 'BAD_REQUEST',

  // 401
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_PIN = 'INVALID_PIN',
  INVALID_FORM = 'Formulaire invalide',

  // 403
  UNAUTHORIZED = 'UNAUTHORIZED',
  REPRESENTATION_FULL = 'La représentation sélectionnée est complète',

  // 404
  NOT_FOUND = 'NOT_FOUND',

  // 500
  UNKNOWN = 'UNKNOWN',
}

// Express method merging
declare module 'express' {
  interface Request {
    user?: Token;
  }
}

export interface BodyRequest<T> extends Request {
  body: T;
}
