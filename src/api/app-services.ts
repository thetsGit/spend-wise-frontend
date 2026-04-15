import type { $Fetch } from "ofetch";

import type { TResponse, TErrorData } from "@/types/api";

import type {
  UploadSummary,
  SaaSDiscovery,
  SaaSDiscoverySummary,
  Spending,
  SpendingSummary,
} from "@/types/entities";

import type { GetSpendingParams } from "./types";

import { appApi } from "./sources";

export const createAppServices = (api: $Fetch = appApi) => {
  const uploadEmails = () => {
    type Response = TResponse<UploadSummary>;
    let abortController: AbortController;

    const request = async (payload: string) => {
      abortController = new AbortController();
      return api<Response>("/emails/upload", {
        method: "POST",
        signal: abortController.signal,
        body: payload,
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

  const getSaaSDiscoveries = () => {
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

  const getSaaSDiscoverySummary = () => {
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

  const getSpending = () => {
    type Response = TResponse<Spending[]>;
    let abortController: AbortController;

    const request = (params?: GetSpendingParams) => {
      abortController = new AbortController();
      return api<Response>("/spending", {
        method: "GET",
        signal: abortController.signal,
        params,
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

  const getSpendingSummary = () => {
    type Response = TResponse<SpendingSummary>;
    let abortController: AbortController;

    const request = () => {
      abortController = new AbortController();
      return api<Response>("/spending/summary", {
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

  return {
    uploadEmails,

    /**
     * SaaS services
     */

    getSaaSDiscoveries,
    getSaaSDiscoverySummary,

    /**
     * Spending services
     */

    getSpendingSummary,
    getSpending,
  };
};

export const appServices = createAppServices();

export const {
  uploadEmails,

  /**
   * SaaS services
   */

  getSaaSDiscoveries,
  getSaaSDiscoverySummary,

  /**
   * Spending services
   */

  getSpendingSummary,
  getSpending,
} = appServices;

export type TAppServices = ReturnType<typeof createAppServices>;
