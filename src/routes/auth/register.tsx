import { createFileRoute } from "@tanstack/react-router";

import { RegisterView } from "@/views/RegisterView";

export const Route = createFileRoute("/auth/register")({
  component: RegisterView,
});
