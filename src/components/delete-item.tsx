import { Trash2Icon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface DeleteItemProps {
  id: string;
}

export default function DeleteItem({ id }: DeleteItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash2Icon size={16} />
          <span className="sr-only">Delete</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Delete</p>
      </TooltipContent>
    </Tooltip>
  );
}
