import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import Status from "~/components/status";
import { client } from "../lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<
    | Awaited<ReturnType<(typeof client)["api"]["separate"]["post"]>>["data"]
    | null
  >(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const file = new FormData(e.currentTarget).get("file") as File;
      console.log(file);
      const res = await client.api.separate.post({
        file,
        twoStems: false,
      });
      if (res.data) {
        setData(res.data);
      }
    },
    [],
  );

  return (
    <main>
      <h1>Hello, world!</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" required name="file" />
        <button type="submit">Submit</button>
      </form>
      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <Status data={data} />
        </>
      )}
    </main>
  );
}
