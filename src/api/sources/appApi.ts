import { api } from "@/api/sources/baseApi";

import { APP_SERVICES_URL } from "../constants";

export const appApi = api.create({
  baseURL: `${APP_SERVICES_URL}/api`,
  async onRequest() {
    // Handle auth
  },
  onResponseError: async (context) => {
    // Handle auth failss
    return Promise.reject(context);
  },
});

export default appApi;
