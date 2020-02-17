import { Request } from 'express';
/**
 * DISCLAMER: Dans mode développement, la modification de ce fichier ne sera peut-être pas prise en compte par le serveur de dev
 * Redémarrer le serveur dans ce cas là
 */
// General

export enum Permissions {
  Admin = 'admin',
  Orga = 'orga',
}

export interface Token {
  permissions: Permissions;
}

export enum Representation {
  Friday = 'friday',
  Saturday = 'saturday',
}

export enum Error {
  // 400
  BAD_REQUEST = 'Requête invalide',

  // 401
  UNAUTHENTICATED = "Vous n'êtes pas autentifié",
  EXPIRED_TOKEN = 'Session expirée',
  INVALID_TOKEN = 'Session invalide',
  INVALID_PASSWORD = 'Mot de passe invalide',
  INVALID_FORM = 'Formulaire invalide',

  // 403
  UNAUTHORIZED = "Vous n'avez pas l'autorisation d'accéder à cette ressource",
  REPRESENTATION_FULL = 'La représentation sélectionnée est complète',

  // 404
  NOT_FOUND = 'Ressource introuvable',

  // 406
  NOT_ACCEPTABLE = 'Contenu envoyé inacceptable',

  // 500
  UNKNOWN = 'Erreur inconnue',
}

// Express method merging
declare module 'express' {
  interface Request {
    permissions?: Permissions;
    etupay?: EtupayResponse;
  }
}

export interface BodyRequest<T> extends Request {
  body: T;
}

export interface EtupayResponse {
  transactionId: number;
  step: string;
  paid: boolean;
  serviceData: string;
}
