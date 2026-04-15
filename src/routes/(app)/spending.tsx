import { createFileRoute } from "@tanstack/react-router";

import { SpendingView } from "@/views/SpendingView";

export const Route = createFileRoute("/(app)/spending")({
  component: SpendingView,
});
