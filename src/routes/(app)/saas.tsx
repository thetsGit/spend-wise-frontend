import { createFileRoute } from "@tanstack/react-router";

import { SaaSView } from "@/views/SaaSView";

export const Route = createFileRoute("/(app)/saas")({
  component: SaaSView,
});
