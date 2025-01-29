import { AudioLines } from "lucide-react";

import GitHub from "./icons/github";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full border-b bg-background lg:px-4">
      <div className="container flex w-full items-center justify-between">
        <a
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          href="/"
        >
          <AudioLines size={16} />
          <span className="font-medium">demucs-web</span>
        </a>
        <div className="flex items-center space-x-1">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function GitHubLink() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" asChild>
          <a href="https://github.com/podter/demucs-web">
            <GitHub size={16} />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>GitHub</p>
      </TooltipContent>
    </Tooltip>
  );
}
