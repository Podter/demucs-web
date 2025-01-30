import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import {
  AudioLinesIcon,
  DownloadIcon,
  DrumIcon,
  GuitarIcon,
  MicVocalIcon,
  Trash2Icon,
} from "lucide-react";

import type { ResultType } from "~/db/schema";
import DeleteItem from "~/components/delete-item";
import { Button } from "~/components/ui/button";

interface Track {
  name: string;
  icon: LucideIcon;
}

const DEFAULT_TRACKS = [
  { name: "vocals.mp3", icon: MicVocalIcon },
  { name: "drums.mp3", icon: DrumIcon },
  { name: "bass.mp3", icon: GuitarIcon },
  { name: "other.mp3", icon: AudioLinesIcon },
] satisfies Track[];

const TWO_STEMS_TRACKS = [
  { name: "vocals.mp3", icon: MicVocalIcon },
  { name: "no_vocals.mp3", icon: AudioLinesIcon },
] satisfies Track[];

interface PlayerProps {
  data: ResultType;
}

export default function Player({ data }: PlayerProps) {
  const sounds = useMemo(() => {
    const tracks = data.twoStems ? TWO_STEMS_TRACKS : DEFAULT_TRACKS;
    return tracks.map((track) => ({
      url: `/file/${data.id}/${track.name}`,
      icon: track.icon,
    }));
  }, [data]);

  return (
    <main className="flex w-full flex-col items-center space-y-6 px-6 py-12">
      <h1 className="text-xl font-semibold">{data.name}</h1>
      <div className="flex w-full flex-col items-center space-y-4">
        {sounds.map(({ url, icon: Icon }) => (
          <div className="flex w-full max-w-lg items-center space-x-3">
            <Icon />
            <audio src={url} controls className="w-full" key={url} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild>
          <a href={`/file/${data.id}/original.mp3`} download>
            <DownloadIcon />
            Original
          </a>
        </Button>
        <DeleteItem id={data.id} name={data.name} variant="outline">
          <Trash2Icon />
          Delete
        </DeleteItem>
      </div>
    </main>
  );
}
