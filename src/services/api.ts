import { ofetch } from "ofetch";

import {
  APP_SERVICE_URL,
  RETRY_COUNT,
  RETRY_DELAY,
} from "@/services/constants";

export const api = ofetch.create({
  baseURL: `${APP_SERVICE_URL}/api`,
  retryDelay: RETRY_DELAY,
  retry: RETRY_COUNT,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

export default api;
