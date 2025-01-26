import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "~/components/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/counter">Counter</Link>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
