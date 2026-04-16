import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import {
  exchangeToken,
  exchangeError as reactiveExchangeError,
} from "@/states/oauth";

import { useSignal } from "@/hooks";

export function AuthCallbackView() {
  const navigate = useNavigate();

  const exchangeError = useSignal(reactiveExchangeError);

  const search = useSearch({
    from: "/auth/callback",
  });

  useEffect(() => {
    const code = search["code"];
    if (code) {
      exchangeToken(code);
    }
  }, []);

  const code = search["code"];
  const error = search["error"] || exchangeError;

  let eMessage = "";

  if (error) {
    eMessage = `Authentication failed: ${error}`;
    // setError(eMessage);
    console.error(`Authentication failed: ${error}`);
    return;
  }

  if (!code) {
    eMessage = "No authorization code received";
    // setError(eMessage);
    console.error("No authorization code received");
    return;
  }

  if (eMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600">
            Authentication Error
          </h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate({ to: "/auth/register" })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
