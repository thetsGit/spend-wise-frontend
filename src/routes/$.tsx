import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

import { isAuthenticated as rIsAuthenticated } from "@/states/oauth";

import { useSignal } from "@/hooks";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});

/**
 * Handle any unmatched routes
 */
function RouteComponent() {
  const isAuthenticated = useSignal(rIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <Navigate to="/auth/register" />;
}
