export const devEnv = () => process.env.NODE_ENV === 'development';
export const maxPlaces = parseInt(process.env.APP_MAX_PLACES);
export const expirationOrder = parseInt(process.env.APP_EXPIRATION_ORDER);
export const etupayId = parseInt(process.env.ETUPAY_ID);
export const etupayKey = process.env.ETUPAY_KEY;
export const etupayUrl = process.env.ETUPAY_URL;
