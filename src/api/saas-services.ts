import type { TResponse, TErrorData } from "@/types/api";
import type { SaaSDiscovery, SaaSDiscoverySummary } from "@/types/entities";

import api from "./api-client";

export const getSaaSDiscoveries = () => {
  type Response = TResponse<SaaSDiscovery[]>;
  let abortController: AbortController;

  const request = () => {
    abortController = new AbortController();
    return api<Response>("/saas", {
      method: "GET",
      signal: abortController.signal,
    });
  };

  const resolver = (response: Response) => response.data;

  const errorResolver = (response: Response): TErrorData | null => {
    if (response.status !== "success")
      return { message: response.message, error: response.error };
    return null;
  };

  const abort = () => abortController?.abort();

  return { request, resolver, abort, errorResolver };
};

export const getSaaSDiscoverySummary = () => {
  type Response = TResponse<SaaSDiscoverySummary>;
  let abortController: AbortController;

  const request = () => {
    abortController = new AbortController();
    return api<Response>("/saas/summary", {
      method: "GET",
      signal: abortController.signal,
    });
  };

  const resolver = (response: Response) => response.data;

  const errorResolver = (response: Response): TErrorData | null => {
    if (response.status !== "success")
      return { message: response.message, error: response.error };
    return null;
  };

  const abort = () => abortController?.abort();

  return { request, resolver, abort, errorResolver };
};
