export const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
export const OAUTH_CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET;
export const OAUTH_GRANT_TYPE = "authorization_code";
export const OAUTH_REDIRECT_URI = `${window.location.origin}/auth/callback`;
export const OAUTH_AUTH_URL = import.meta.env.VITE_OAUTH_AUTH_URL;

export const OAUTH_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
].join(" ");
