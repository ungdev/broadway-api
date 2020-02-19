export const devEnv = () => process.env.NODE_ENV === 'development';
export const maxPlaces = () => parseInt(process.env.APP_MAX_PLACES);
export const representationCount = () => parseInt(process.env.APP_REPRESENTATION_COUNT);
export const orderExpiration = () => parseInt(process.env.APP_ORDER_EXPIRATION);
export const etupayId = () => parseInt(process.env.ETUPAY_ID);
export const etupayKey = () => process.env.ETUPAY_KEY;
export const etupayUrl = () => process.env.ETUPAY_URL;
export const orgaPassword = () => process.env.APP_ORGA_PASSWORD;
export const adminPassword = () => process.env.APP_ADMIN_PASSWORD;
export const tokenSecret = () => process.env.APP_TOKEN_SECRET;
export const tokenExpires = () => process.env.APP_TOKEN_EXPIRES;
export const successUrl = () => process.env.ETUPAY_SUCCESSURL;
export const failureUrl = () => process.env.ETUPAY_ERRORURL;
