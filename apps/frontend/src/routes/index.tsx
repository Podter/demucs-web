import { createFileRoute } from "@tanstack/react-router";

import { client } from "../lib/api";

export const Route = createFileRoute("/")({
  component: Index,
  loader: () =>
    client.api.hello.get({
      query: {
        name: "world",
      },
    }),
  pendingComponent: () => <main>Loading...</main>,
});

function Index() {
  const { data } = Route.useLoaderData();
  return (
    <main>
      <h1>{data?.message}</h1>
    </main>
  );
}
