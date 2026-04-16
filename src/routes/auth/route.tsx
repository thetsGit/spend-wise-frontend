import {
  createFileRoute,
  Outlet,
  Navigate,
  redirect,
} from "@tanstack/react-router";

import { isAuthenticated as reactiveIsAuthenticated } from "@/states/oauth";

import { useSignal } from "@/hooks";

export const Route = createFileRoute("/auth")({
  /**
   * Disable 'index' route (/auth)
   */
  beforeLoad: ({ location }) => {
    if (location.pathname === "/auth") {
      throw redirect({ to: "/$" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = useSignal(reactiveIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}
