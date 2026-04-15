import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { Home, CreditCard, Search } from "lucide-react";

import type { FileRouteTypes } from "@/routeTree.gen";

import { AppLayout, type NavItem } from "@/components/layout";

export const Route = createFileRoute("/(app)")({
  component: RouteComponent,
});

const NAV_ITEMS: NavItem<FileRouteTypes["to"]>[] = [
  { key: "/home", label: "Home", icon: Home },
  { key: "/saas", label: "Spending", icon: CreditCard },
  { key: "/spending", label: "SaaS Discovery", icon: Search },
];

function RouteComponent() {
  const navigate = useNavigate();
  const location = useLocation();

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
