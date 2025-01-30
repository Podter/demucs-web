import { useMemo } from "react";
import {
  AudioLinesIcon,
  CheckIcon,
  ClockIcon,
  DrumIcon,
  GuitarIcon,
  MicVocalIcon,
  XIcon,
} from "lucide-react";

import type { ResultType } from "~/db/schema";
import { labelVariants } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useResult } from "~/hooks/use-result";

interface ResultItemProps {
  initialData: ResultType;
}

export default function ResultItem({ initialData }: ResultItemProps) {
  const { id, name, status, twoStems, expiresAt } = useResult(initialData);

  const timeUntilExpiration = useMemo(() => {
    const expires =
      typeof expiresAt === "object"
        ? expiresAt.getTime()
        : new Date(expiresAt).getTime();

    const now = Date.now();
    const diff = expires - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    return "less than a minute";
  }, [expiresAt]);

  return (
    <a
      href={`/result/${id}`}
      className="flex w-full items-center justify-between border-x border-t p-4 transition-colors first:rounded-t-xl last:rounded-b-xl last:border-b hover:bg-accent hover:text-accent-foreground"
    >
      <div className="flex items-center space-x-3">
        <AudioLinesIcon size={24} />
        <div className="space-y-1.5">
          <p className={labelVariants()}>{name}</p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="flex items-center gap-1 text-[0.8rem]">
              <ClockIcon className="h-[0.8rem] w-[0.8rem]" />
              {timeUntilExpiration}
            </div>
            <div className="flex gap-1 *:h-[0.8rem] *:w-[0.8rem]">
              {twoStems ? (
                <>
                  <MicVocalIcon /> <AudioLinesIcon />
                </>
              ) : (
                <>
                  <MicVocalIcon /> <DrumIcon /> <GuitarIcon />
                  <AudioLinesIcon />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {status === "success" ? (
        <CheckIcon size={16} />
      ) : status === "processing" ? (
        <Spinner size={16} />
      ) : (
        <XIcon size={16} />
      )}
    </a>
  );
}
