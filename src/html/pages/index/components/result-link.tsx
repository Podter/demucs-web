import { ArrowRightIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface ResultLinkProps {
  href: string;
}

export default function ResultLink({ href }: ResultLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" asChild>
          <a href={href}>
            <ArrowRightIcon size={16} />
            <span className="sr-only">Open</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Open</p>
      </TooltipContent>
    </Tooltip>
  );
}
