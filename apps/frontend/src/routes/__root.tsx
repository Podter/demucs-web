import { createRootRoute, Outlet } from "@tanstack/react-router";

import Header from "~/components/header";
import { TanStackRouterDevtools } from "~/components/router-devtools";
import { ThemeProvider } from "~/components/theme-provider";
import { TooltipProvider } from "~/components/ui/tooltip";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <TooltipProvider>
        <Header />
        <Outlet />
        <TanStackRouterDevtools />
      </TooltipProvider>
    </ThemeProvider>
  ),
});
