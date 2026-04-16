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
