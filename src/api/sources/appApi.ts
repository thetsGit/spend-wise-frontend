import type { TResponse } from "@/types/api";

import { accessToken, setAccessToken } from "@/states/oauth";

import {
  APP_SERVICES_URL,
  LOGOUT_ROUTE,
  UNAUTHORIZED_STATUSES,
} from "../constants";

import { api } from "./baseApi";

export const appApi = api.create({
  baseURL: `${APP_SERVICES_URL}/api`,
  async onRequest({ options }) {
    // Include 'access token' for authorized requests
    if (accessToken.value) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${accessToken.value}`);
    }
  },
  onResponse: async (context) => {
    const { response: rawResponse } = context;

    /**
     * 401 redirection logic here
     */
    const { url } = rawResponse;
    const parsedUrl = URL.parse(url);
    const isLogoutEndpoint = parsedUrl?.pathname === `api${LOGOUT_ROUTE}`;

    const { status_code } = rawResponse._data as TResponse<unknown>;

    if (
      accessToken.value &&
      !isLogoutEndpoint &&
      UNAUTHORIZED_STATUSES.includes(status_code)
    ) {
      // Revoke current access token
      setAccessToken();
    }
  },
});

export default appApi;
