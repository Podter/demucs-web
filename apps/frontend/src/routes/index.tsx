import { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { client } from "../lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const file = new FormData(e.currentTarget).get("file") as File;
      console.log(file);
      const res = await client.api.separate.post({
        file,
        twoStems: false,
      });
      console.log(res);
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
    </main>
  );
}
