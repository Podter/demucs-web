import { useCallback, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FileMusicIcon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import ChevronRight from "~/components/icons/chevron-right";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useSeparations } from "~/hooks/use-separations";
import { client } from "~/lib/api";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/" });
  const { addSeparation, separations } = useSeparations();

  const [twoStems, setTwoStems] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { isDragAccept, getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      "audio/*": [],
    },
    maxFiles: 1,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file) {
        setFile(file);
      }
    },
  });

  const separate = useCallback(async () => {
    if (!file) {
      return;
    }

    const result = await client.api.separate.post({
      file,
      twoStems,
    });

    if (result.status === 200 && result.data) {
      addSeparation(result.data);
      navigate({ to: "/$id", params: { id: result.data.id } });
    } else {
      // TODO: handle error
    }
  }, [addSeparation, file, twoStems, navigate]);

  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
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
                ? "or click to select another file"
                : "or click to select a file"}
            </p>
          </div>
          <Button onClick={open} variant="secondary">
            Select file
          </Button>
          <input {...getInputProps()} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="two-stems"
            checked={twoStems}
            onCheckedChange={setTwoStems}
          />
          <Label htmlFor="two-stems">
            Only separate vocals and instrumental
          </Label>
        </div>
        <Button className="group" onClick={separate}>
          Separate <ChevronRight />
        </Button>
      </div>
      {separations.map(({ id }) => (
        <Link to="/$id" params={{ id }} key={id}>
          {id}
        </Link>
      ))}
    </main>
  );
}
