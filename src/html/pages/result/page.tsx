import { CircleAlertIcon, Trash2Icon } from "lucide-react";

import type { ResultType } from "~/db/schema";
import DeleteItem from "~/components/delete-item";
import { Spinner } from "~/components/ui/spinner";
import { useResult } from "~/hooks/use-result";
import Player from "./components/player";

export default function Result(initialData: ResultType) {
  const result = useResult(initialData);

  if (result.status === "processing") {
    return (
      <main className="flex w-full flex-col items-center px-4 py-12 text-center">
        <div className="flex max-w-lg flex-col items-center space-y-3">
          <div className="flex items-center space-x-2">
            <Spinner size={16} />
            <h1 className="font-medium">Processing your track</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Your track is being processed. This may take around 5-10 minutes.
            You can close this page and come back later.
          </p>
        </div>
      </main>
    );
  }

  if (result.status === "success") {
    return <Player data={result} />;
  }

  return (
    <main className="flex w-full flex-col items-center space-y-4 px-4 py-12 text-center">
      <div className="flex max-w-lg flex-col items-center space-y-3">
        <div className="flex items-center space-x-2">
          <CircleAlertIcon size={16} />
          <h1 className="font-medium">Something went wrong</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          We are sorry, but something went wrong while processing your track.
          Please try again later.
        </p>
      </div>
      <DeleteItem
        id={result.id}
        name={result.name}
        variant="destructive"
        size="sm"
      >
        <Trash2Icon />
        Delete
      </DeleteItem>
    </main>
  );
}
