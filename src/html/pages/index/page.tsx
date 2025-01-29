import { useMemo } from "react";
import { FileMusicIcon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import type { ResultType } from "~/db/schema";
import ChevronRight from "~/components/icons/chevron-right";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useResult } from "~/hooks/use-result";
import { cn } from "~/lib/utils";

interface IndexProps {
  results: ResultType[];
}

function ResultLink(initialData: ResultType) {
  const { id, name, status } = useResult(initialData);
  return (
    <a href={`/result/${id}`}>
      {id}: {name} ({status})
    </a>
  );
}

export default function Index({ results }: IndexProps) {
  const { isDragAccept, getRootProps, getInputProps, open, acceptedFiles } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      accept: {
        "audio/*": [],
      },
      maxFiles: 1,
      multiple: false,
    });

  const file = useMemo(() => acceptedFiles[0], [acceptedFiles]);

  return (
    <main className="flex w-full flex-col items-center space-y-8 px-6 pt-12 lg:pt-20">
      {/* TODO: change this */}
      <h1 className="text-center text-5xl font-bold">
        Separate vocals from music tracks
      </h1>
      <p className="max-w-lg text-center text-muted-foreground">
        Isolate vocals from music tracks with our AI-powered tool. Upload your
        audio file and let the magic happen.
      </p>
      <form
        method="POST"
        action="/"
        encType="multipart/form-data"
        className="flex w-full flex-col items-center justify-center space-y-6"
      >
        <div
          {...getRootProps({
            className: cn(
              "flex w-full max-w-sm flex-col items-center space-y-6 rounded-lg bg-card p-8 text-card-foreground shadow-sm outline-dashed outline-2 outline-border",
              isDragAccept && "bg-accent transition-colors dark:bg-accent/50",
            ),
          })}
        >
          {file ? <FileMusicIcon size={48} /> : <UploadIcon size={48} />}
          <div className="flex flex-col items-center space-y-2 text-center">
            <p>{file ? file.name : "Drag and drop your file here"}</p>
            <p className="text-sm text-muted-foreground">
              {file
                ? "or click to browse another file"
                : "or click to browse a file"}
            </p>
          </div>
          <Button onClick={open} variant="secondary" type="button">
            Browse files
          </Button>
          <input
            {...getInputProps({
              name: "file",
              required: true,
            })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="two-stems" name="two_stems" defaultChecked />
          <Label htmlFor="two-stems">
            Only separate vocals and instrumental
          </Label>
        </div>
        <Button className="group" type="submit">
          Separate <ChevronRight />
        </Button>
      </form>
      {results.map((result) => (
        <ResultLink {...result} key={result.id} />
      ))}
    </main>
  );
}
