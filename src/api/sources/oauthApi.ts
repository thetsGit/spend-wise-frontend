import { api } from "@/api/sources/baseApi";
import { OAUTH_SERVICES_URL } from "@/api/constants";

export const oauthApi = api.create({
  baseURL: OAUTH_SERVICES_URL,
});

export default oauthApi;
