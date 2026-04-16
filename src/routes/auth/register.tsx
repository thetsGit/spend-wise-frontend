import { createFileRoute } from "@tanstack/react-router";

import { redirect } from "@/states/oauth";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button onClick={redirect}>Continue with google</Button>
    </div>
  );
}
