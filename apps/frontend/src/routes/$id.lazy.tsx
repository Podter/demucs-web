import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/$id"!</div>;
}
