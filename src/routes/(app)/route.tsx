import {
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  createFileRoute,
} from "@tanstack/react-router";

import { Home, CreditCard, Search } from "lucide-react";

import { isAuthenticated as reactiveIsAuthenticated } from "@/states/oauth";

import { useSignal } from "@/hooks";

import { AppLayout, type NavItem } from "@/components/layout";

import type { FileRouteTypes } from "@/routeTree.gen";

export const Route = createFileRoute("/(app)")({
  component: RouteComponent,
});

const NAV_ITEMS: NavItem<FileRouteTypes["to"]>[] = [
  { key: "/home", label: "Home", icon: Home },
  { key: "/spending", label: "Spending", icon: CreditCard },
  { key: "/saas", label: "SaaS Discovery", icon: Search },
];

function RouteComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSignal(reactiveIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/register" />;
  }

  return (
    <AppLayout
      activeView={location.pathname}
      navItems={NAV_ITEMS}
      onSelect={(to) =>
        navigate({
          to,
        })
      }
    >
      <Outlet />
    </AppLayout>
  );
}
