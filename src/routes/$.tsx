import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});

function RouteComponent() {
  // Redirect to 'home' page is authenticated, otherwise - 'sign-up' page
  return <div>Not found route</div>;
}
