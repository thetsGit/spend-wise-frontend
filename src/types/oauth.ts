export interface User {
  id: number;
  google_id: string;
  email: string;
}

export interface OauthTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
}

export interface OauthTokenErrorResponse {
  error: string;
  error_description: string;
}

export function isOauthTokenErrorResponse(
  res: OauthTokenResponse | OauthTokenErrorResponse,
): res is OauthTokenErrorResponse {
  return "error" in res && "error_description" in res;
}
