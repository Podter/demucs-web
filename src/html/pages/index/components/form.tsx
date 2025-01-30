import { useMemo, useRef } from "react";
import { FileMusicIcon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import ChevronRight from "~/components/icons/chevron-right";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

export default function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDragAccept, getRootProps, getInputProps, open, acceptedFiles } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      accept: {
        "audio/*": [],
      },
      maxFiles: 1,
      multiple: false,
      onDrop: (files) => {
        if (inputRef.current) {
          const dataTransfer = new DataTransfer();
          files.forEach((v) => {
            dataTransfer.items.add(v);
          });
          inputRef.current.files = dataTransfer.files;
        }
      },
    });

  const file = useMemo(() => acceptedFiles[0], [acceptedFiles]);

  return (
    <form
      method="POST"
      action="/"
      encType="multipart/form-data"
      className="flex w-full flex-col items-center space-y-6"
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
          type="file"
          name="file"
          required
          accept="audio/*"
          className="sr-only"
          ref={inputRef}
        />
        <input {...getInputProps()} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="two-stems" name="two_stems" defaultChecked />
        <Label htmlFor="two-stems">Only separate vocals and instrumental</Label>
      </div>
      <Button className="group" type="submit">
        Separate <ChevronRight />
      </Button>
    </form>
  );
}
