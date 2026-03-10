import { useEffect, useState } from "react";

import type { SeparationData } from "~/lib/schema";
import { SeparationDataSchema } from "~/lib/schema";

interface LogsProps {
  id: string;
}

export default function Logs({ id }: LogsProps) {
  const [data, setData] = useState<SeparationData | null>(null);

  useEffect(() => {
    const sse = new EventSource(`/api/${id}/sse`);
    sse.addEventListener("status", (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setData(SeparationDataSchema.parse(JSON.parse(event.data)));
    });
  }, [id]);

  return (
    <pre>
      <code>{data ? data.logs : ""}</code>
    </pre>
  );
}
