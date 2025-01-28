import { createRootRoute, Outlet } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "~/components/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
