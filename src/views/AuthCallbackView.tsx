import { useEffect, useRef } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, ShieldAlert, RotateCcw } from "lucide-react";

import {
  loginStates as rLoginStates,
  exchangeToken,
  verifyWithServer,
} from "@/states/oauth";
import { useSignal } from "@/hooks";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuthCallbackView() {
  const navigate = useNavigate();
  const loginStates = useSignal(rLoginStates);
  const hasExchanged = useRef(false);

  const search = useSearch({ from: "/auth/callback" });
  const code = search["code"];

  const error = (() => {
    const oauthCallbackError = search["error"];
    if (oauthCallbackError)
      return `Authentication failed: ${oauthCallbackError}`;
    if (!code) return "No authorization code received";
    return loginStates.error;
  })();

  useEffect(() => {
    if (code && !hasExchanged.current) {
      exchangeToken(code, verifyWithServer);
      hasExchanged.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          {error ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <ShieldAlert className="h-7 w-7 text-red-600" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900">
                Authentication failed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {error}
              </p>
              <Button
                onClick={() => navigate({ to: "/auth/register" })}
                className="mt-6 gap-2"
              >
                <RotateCcw size={16} />
                Try again
              </Button>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900">
                Completing sign in
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Hang tight, this only takes a moment.
              </p>
              <div className="mt-6 w-full space-y-2">
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
                <div className="h-2 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
