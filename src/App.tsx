import { useState } from "react";
import { Toaster } from "sonner";

import { VIEWS, NAV_ITEMS, type View } from "@/constants/views";

import { HomeView } from "@/views/HomeView";
import { SpendingView } from "@/views/SpendingView";
import { SaaSView } from "@/views/SaaSView";

import { AppLayout } from "@/components/layout";

export default function App() {
  const [view, setView] = useState<View>(VIEWS.home);

  return (
    <>
      <Toaster richColors />

      <AppLayout activeView={view} navItems={NAV_ITEMS} onSelect={setView}>
        {view === VIEWS.home && (
          <HomeView key={VIEWS.home} onSelect={setView} />
        )}
        {view === VIEWS.spending && <SpendingView key={VIEWS.spending} />}
        {view === VIEWS.saas && <SaaSView key={VIEWS.saas} />}
      </AppLayout>
    </>
  );
}
