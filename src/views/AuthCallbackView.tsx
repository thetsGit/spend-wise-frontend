import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import {
  authenticateStates as rAuthenticateStates,
  exchangeToken,
  verifyWithServer,
} from "@/states/oauth";

import { useSignal } from "@/hooks";

export function AuthCallbackView() {
  const navigate = useNavigate();

  const authenticateStates = useSignal(rAuthenticateStates);

  const search = useSearch({
    from: "/auth/callback",
  });

  const code = search["code"];

  const error = (() => {
    const oauthCallbackError = search["error"];

    if (oauthCallbackError)
      return `Authentication failed: ${oauthCallbackError}`;

    if (!code) return "No authorization code received";

    return authenticateStates.error;
  })();

  useEffect(() => {
    if (code) {
      // Immediately trigger token exchange and server verification
      exchangeToken(code, verifyWithServer);
    }
  }, []);

  if (error) {
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
