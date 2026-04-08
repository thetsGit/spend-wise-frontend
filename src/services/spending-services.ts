import type { TResponse, TErrorData } from "@/types/api";
import type { Spending, SpendingSummary } from "@/types/entities";

import type { GetSpendingParams } from "./types";

import api from "./api";

export const getSpending = () => {
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

export const getSpendingSummary = () => {
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
