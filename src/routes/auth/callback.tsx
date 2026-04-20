import { createFileRoute } from "@tanstack/react-router";

import { AuthCallbackView } from "@/views/AuthCallbackView";

type CallbackQParams = {
  code: string;
  error: string;
};

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackView,
  validateSearch: (cbParams: Record<string, unknown>): CallbackQParams => {
    // Validate and parse the search params into a typed state
    return {
      code: String(cbParams.code ?? ""),
      error: String(cbParams.error ?? ""),
    };
  },
});
