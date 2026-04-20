import { ofetch } from "ofetch";

import { RETRY_COUNT, RETRY_DELAY } from "@/api/constants";

export const api = ofetch.create({
  retryDelay: RETRY_DELAY,
  retry: RETRY_COUNT,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

export default api;
