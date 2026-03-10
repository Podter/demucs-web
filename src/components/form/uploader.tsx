/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { IconFileMusic, IconUpload } from "@tabler/icons-react";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

export default function Uploader() {
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
    <div
      {...getRootProps({
        className: cn(
          "flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-6 text-center text-balance",
          isDragAccept && "bg-accent transition-colors",
        ),
      })}
    >
      <div className="flex flex-col items-center gap-2">
        {file ? (
          <IconFileMusic size={32} className="mb-2" />
        ) : (
          <div className="bg-muted text-foreground mb-2 flex size-8 shrink-0 items-center justify-center rounded-lg">
            <IconUpload className="shrink-0" size={16} />
          </div>
        )}
        <p className="text-sm font-medium tracking-tight">
          {file ? file.name : "Drag and drop your file here"}
        </p>
        <p className="text-muted-foreground text-sm/relaxed">
          {file
            ? "or click to browse another file"
            : "or click to browse a file"}
        </p>
      </div>
      <div className="flex w-full justify-center">
        <Button onClick={open} variant="outline" size="sm" type="button">
          Browse files
        </Button>
      </div>
      <input {...getInputProps({ name: "file", required: true })} />
    </div>
  );
}
