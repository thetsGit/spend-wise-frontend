import type { User } from "@/types/entities";

export type GetSpendingParams = {
  category?: string;
  start_date?: string;
  end_date?: string;
};

export type OAuthTokenExchangeParams = {
  client_id: string;
  client_secret: string;
  code: string;
  code_verifier: string;
  grant_type: string;
  redirect_uri: string;
};

export type OauthTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
};

export type OauthTokenErrorResponse = {
  error: string;
  error_description: string;
};

export function isOauthTokenErrorResponse(
  res: OauthTokenResponse | OauthTokenErrorResponse,
): res is OauthTokenErrorResponse {
  return "error" in res && "error_description" in res;
}

export type RegisterOauthResponse = {
  user: User;
  session_token: string;
};
