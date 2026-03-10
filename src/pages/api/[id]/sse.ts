import type { APIRoute } from "astro";

import { getSeparationData, subscribeSeparation } from "~/lib/redis";

export const GET = (async ({ params, session, request }) => {
  if (!params.id) {
    return new Response(null, { status: 400 });
  }

  const separationIds = await session?.get("separation-ids");
  if (!separationIds?.includes(params.id)) {
    return new Response(null, { status: 400 });
  }

  const data = await getSeparationData(params.id);
  if (!data) {
    return new Response(null, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const unsubscribe = await subscribeSeparation(
        params.id ?? "",
        (update) => {
          const data = `event: status\ndata: ${JSON.stringify(update)}\n\n`;
          controller.enqueue(encoder.encode(data));
        },
      );

      request.signal.addEventListener("abort", () => {
        void unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}) satisfies APIRoute;
