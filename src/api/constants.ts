export const RETRY_DELAY = 5000;
export const RETRY_COUNT = 3;

export const UNAUTHORIZED_STATUSES = [401];
export const LOGOUT_ROUTE = "/auth/logout";

export const APP_SERVICES_URL = `${import.meta.env.VITE_APP_API_URL}` || "";
export const OAUTH_SERVICES_URL = `${import.meta.env.VITE_OAUTH_API_URL}` || "";
