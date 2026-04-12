import type { TErrorData, TResponse } from "@/types/api";
import type { UploadSummary } from "@/types/entities";

import api from "./api-client";

export const uploadEmails = () => {
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
