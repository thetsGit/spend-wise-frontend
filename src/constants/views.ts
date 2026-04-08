import { Home, CreditCard, Search } from "lucide-react";

export const VIEWS = {
  home: "home",
  spending: "spending",
  saas: "saas",
} as const;

export type View = (typeof VIEWS)[keyof typeof VIEWS];

export const NAV_ITEMS = [
  { key: VIEWS.home, label: "Home", icon: Home },
  { key: VIEWS.spending, label: "Spending", icon: CreditCard },
  { key: VIEWS.saas, label: "SaaS Discovery", icon: Search },
];
