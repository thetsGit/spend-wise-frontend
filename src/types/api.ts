import { FetchError } from "ofetch";

export type TResponse<T> = {
  data?: T;
  status: "success" | "error";
  status_code: number;
  message: string;
  error?: string;
};

export type ApiRequest<TPayload, TRes, TResult = TRes, TError = unknown> = {
  request: (payload: TPayload) => Promise<TRes>;
  resolver: (response: TRes) => TResult;
  errorResolver: (response: TRes) => TError;
  abort: VoidFunction;
};

export type TErrorData = {
  error?: string;
  message: string;
};

/**
 * Predicates
 */

export function isFetchError<T = unknown>(e: unknown): e is FetchError<T> {
  return e instanceof FetchError;
}
