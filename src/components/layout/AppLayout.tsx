import { type FC, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { type View } from "@/constants/views";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type NavItem = {
  key: View;
  label: string;
  icon: LucideIcon;
};

type Props = {
  children: ReactNode;
  activeView: View;
  navItems: NavItem[];
  onSelect: (view: View) => void;
};

export const AppLayout: FC<Props> = ({
  children,
  activeView,
  navItems,
  onSelect,
}) => {
  return (
    <div className="flex h-screen">
      <aside className="flex w-56 flex-col border-r bg-white">
        <div className="p-5">
          <h1 className="text-lg font-semibold tracking-tight text-emerald-700">
            SpendWise
          </h1>
          <p className="text-xs text-muted-foreground">
            Email expense analyzer
          </p>
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.key}
                variant={activeView === item.key ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  activeView === item.key
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "text-muted-foreground hover:text-emerald-700"
                }`}
                onClick={() => onSelect(item.key)}
              >
                <Icon size={18} />
                {item.label}
              </Button>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4 text-xs text-muted-foreground">
          Powered by AI analysis
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-emerald-50/30 p-6">
        {children}
      </main>
    </div>
  );
};
