import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

import { isAuthenticated as reactiveIsAuthenticated } from "@/states/oauth";

import { useSignal } from "@/hooks";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});

/**
 * Handle any fallback routes
 */
function RouteComponent() {
  const isAuthenticated = useSignal(reactiveIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <Navigate to="/auth/register" />;
}
