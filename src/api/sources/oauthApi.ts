import { api } from "@/api/sources/baseApi";

import { OAUTH_SERVICES_URL } from "../constants";

export const oauthApi = api.create({
  baseURL: OAUTH_SERVICES_URL,
  async onRequest() {
    // Handle auth
  },
  onResponseError: async (context) => {
    // Handle auth failss
    return Promise.reject(context);
  },
});

export default oauthApi;
