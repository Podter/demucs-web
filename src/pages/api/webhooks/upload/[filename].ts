import type { APIRoute } from "astro";

import { validateId } from "~/lib/id";
import { saveSeparationFile } from "~/lib/redis";

export const PUT = (async ({ request, params }) => {
  if (!params.filename) {
    return new Response(null, { status: 400 });
  }

  const [idHmacBase64, filename] = params.filename.split("-");
  if (!(idHmacBase64 && filename)) {
    return new Response(null, { status: 400 });
  }

  const idResult = validateId(idHmacBase64);
  if (!idResult.valid) {
    return new Response(null, { status: 400 });
  }

  await saveSeparationFile(
    idResult.id,
    filename,
    request.headers.get("Content-Type") ?? "application/octet-stream",
    new Uint8Array(await request.arrayBuffer()),
  );

  return new Response(null, { status: 204 });
}) satisfies APIRoute;
