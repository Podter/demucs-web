import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";

import { cn } from "~/lib/utils";

export default function Footer() {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    function handleScroll() {
      setIsTop(window.scrollY < 20);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={cn(
        "fixed bottom-0 z-50 flex w-full border-t bg-background opacity-100 transition-transform duration-300 lg:px-4",
        !isTop && "translate-y-20 sm:translate-y-14",
      )}
    >
      <div className="container flex w-full flex-col items-center justify-between space-y-1 py-[14px] sm:flex-row">
        <a
          className="flex items-center space-x-1.5 text-sm text-muted-foreground transition-opacity hover:opacity-80"
          href="https://podter.me"
        >
          <HeartIcon size={12} />
          <span className="font-medium">Made by Podter</span>
        </a>
        <p className="flex items-center text-sm font-medium text-muted-foreground">
          Powered by ElysiaJS, React, and Demucs
        </p>
      </div>
    </footer>
  );
}
