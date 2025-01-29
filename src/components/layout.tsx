import type { PropsWithChildren } from "react";

import Footer from "./footer";
import Header from "./header";
import { TooltipProvider } from "./ui/tooltip";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <Header />
      {children}
      <Footer />
    </TooltipProvider>
  );
}
