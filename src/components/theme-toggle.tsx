import { IconMoon, IconSun } from "@tabler/icons-react";
import { useCallback } from "react";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ThemeToggle() {
  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <IconSun size={18} className="dark:hidden" />
            <IconMoon size={18} className="hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <TooltipContent>
        <span className="hidden dark:block">Switch to light theme</span>
        <span className="dark:hidden">Switch to dark theme</span>
      </TooltipContent>
    </Tooltip>
  );
}
