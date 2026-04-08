export type TResponse<T> = {
  data?: T;
  status: "success" | "error";
  statusCode: number;
  message: string;
  error?: string;
};

export type ApiRequest<TPayload, TRes, TResult = TRes, TError = unknown> = {
  request: (payload: TPayload) => Promise<TRes>;
  resolver: (response: TRes) => TResult;
  errorResolver: (response: TRes) => TError;
  abort: () => void;
};

export type TErrorData = {
  error?: string;
  message: string;
};
