import type { $Fetch } from "ofetch";

import type { TErrorData } from "@/types/api";

import type {
  OAuthTokenExchangeParams,
  OauthTokenErrorResponse,
  OauthTokenResponse,
} from "./types";

import { isOauthTokenErrorResponse } from "./types";

import { oauthApi } from "./sources/oauthApi";

export const createOAuthServices = (api: $Fetch = oauthApi) => {
  const exchangeToken = () => {
    type Response = OauthTokenResponse | OauthTokenErrorResponse;
    let abortController: AbortController;

    const request = async (params: OAuthTokenExchangeParams) => {
      abortController = new AbortController();
      return api<Response>("/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(params).toString(),
        signal: abortController.signal,
      });
    };

    const resolver = (response: Response) => response;

    const errorResolver = (response: Response): TErrorData | null => {
      if (isOauthTokenErrorResponse(response)) {
        return { message: response.error_description, error: response.error };
      }

      return null;
    };

    const abort = () => abortController?.abort();

    return { request, resolver, abort, errorResolver };
  };

  return {
    exchangeToken,
  };
};

export const oAuthServices = createOAuthServices();

export const { exchangeToken } = oAuthServices;

export type OAuthServices = ReturnType<typeof createOAuthServices>;
