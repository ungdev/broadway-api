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

export enum Error {
  // 400
  BAD_REQUEST = 'Requête invalide',

  // 401
  UNAUTHENTICATED = "Vous n'êtes pas authentifié",
  EXPIRED_TOKEN = 'Session expirée. Veuillez vous reconnecter',
  INVALID_TOKEN = 'Session invalide',
  INVALID_PASSWORD = 'Mot de passe invalide',
  INVALID_FORM = 'Formulaire invalide',

  // 403
  UNAUTHORIZED = "Vous n'avez pas l'autorisation d'accéder à cette ressource",
  REPRESENTATION_FULL = 'La représentation sélectionnée est complète',
  USER_ALREADY_SCANNED = "L'utilisateur a déjà scanné son billet",
  NOT_PAID = "Le billet n'a pas été payé",
  PAYMENT_DISABLED = "L'achat de billets est désactivé",

  // 404
  NOT_FOUND = 'La ressource est introuvable',
  ROUTE_NOT_FOUND = 'La route est introuvable',
  USER_NOT_FOUND = "L'utilisateur est introuvable",
  ORDER_NOT_FOUND = 'La commande est introuvable',

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
