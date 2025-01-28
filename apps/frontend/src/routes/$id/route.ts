import { createFileRoute, notFound } from "@tanstack/react-router";

import { client } from "~/lib/api";
import { getSeparation } from "~/lib/store";

export const Route = createFileRoute("/$id")({
  loader: async ({ params }) => {
    const separation = getSeparation(params.id);
    if (!separation) {
      throw notFound();
    }

    const result = await client.api
      .status({
        id: separation.id,
      })
      .get({
        headers: {
          authorization: `Bearer ${separation.hash}`,
        },
      });

    if (result.status === 404) {
      throw notFound();
    }

    if (result.status !== 200 || !result.data) {
      throw new Error(`Failed to load data:\n${result.error}\n${result.data}`);
    }

    return result.data;
  },
});
