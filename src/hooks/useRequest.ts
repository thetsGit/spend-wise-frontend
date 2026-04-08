import { useState, useCallback, useRef } from "react";

type UseRequestOptions<TPayload, TResult> = {
  onSuccess?: (data: TResult, params: TPayload) => void;
  onError?: (error: unknown, params: TPayload) => void;
};

export function useRequest<TPayload, TResponse, TResult, TError>(
  apiFn: () => {
    request: (payload: TPayload) => Promise<TResponse>;
    resolver: (response: TResponse) => TResult;
    errorResolver: (response: TResponse) => TError | null;
  },
  options?: UseRequestOptions<TPayload, TResult>,
) {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [fetching, setFetching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const pending = data === null && fetching;

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const execute = useCallback(
    async (payload: TPayload): Promise<TResult> => {
      setFetching(true);
      setError(null);

      // Abort previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const { request, resolver, errorResolver } = apiFn();
        const response = await request(payload);

        const errorData = errorResolver(response);
        if (errorData) {
          setError(errorData);
          throw errorData as TError;
        }

        const resolved = resolver(response);
        setData(resolved);
        options?.onSuccess?.(resolved, payload);
        return resolved;
      } catch (err) {
        setError(err);
        options?.onError?.(err, payload);
        throw err;
      } finally {
        setFetching(false);
      }
    },
    [apiFn, options],
  );

  return {
    data,
    error,
    pending,
    fetching,
    execute,
    abort,
  };
}
