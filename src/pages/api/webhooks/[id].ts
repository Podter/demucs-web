import type { APIRoute } from "astro";
import z from "zod";

import { validateId } from "~/lib/id";
import { getSeparationData, saveSeparationData } from "~/lib/redis";
import { SeparationStatusEnum } from "~/lib/schema";

const SeparationWebhookSchema = z.object({
  status: SeparationStatusEnum,
  logs: z.string(),
});

export const POST = (async ({ request, params }) => {
  if (!params.id) {
    return new Response(null, { status: 400 });
  }

  const idResult = validateId(params.id);
  if (!idResult.valid) {
    return new Response(null, { status: 400 });
  }

  const { logs, status } = SeparationWebhookSchema.parse(await request.json());

  const separationData = await getSeparationData(idResult.id);
  if (!separationData) {
    return new Response(null, { status: 400 });
  }

  await saveSeparationData(
    idResult.id,
    {
      ...separationData,
      status,
      logs,
    },
    true,
  );

  return new Response(null, { status: 204 });
}) satisfies APIRoute;
