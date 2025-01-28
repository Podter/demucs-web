import { useCallback } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "light"
        : "dark";
      setTheme(newTheme);
    }
  }, [theme, setTheme]);

  return (
    <Button size="icon" variant="ghost" asChild onClick={toggleTheme}>
      <a href="https://github.com/podter/demucs-web">
        <SunIcon size={16} className="dark:hidden" />
        <MoonIcon size={16} className="hidden dark:block" />
        <span className="sr-only">Toggle theme</span>
      </a>
    </Button>
  );
}
