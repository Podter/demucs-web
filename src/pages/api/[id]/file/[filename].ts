import type { APIRoute } from "astro";

import { validateId } from "~/lib/id";
import { getSeparationFile } from "~/lib/redis";

export const GET = (async ({ params, session }) => {
  if (!(params.id && params.filename)) {
    return new Response(null, { status: 400 });
  }

  let id: string | null = null;

  const separationIds = await session?.get("separation-ids");
  if (separationIds?.includes(params.id)) {
    id = params.id;
  } else {
    const idHmacBase64Result = validateId(params.id);
    if (idHmacBase64Result.valid) {
      id = idHmacBase64Result.id;
    }
  }

  if (!id) {
    return new Response(null, { status: 400 });
  }

  const file = await getSeparationFile(id, params.filename);
  if (!file) {
    return new Response(null, { status: 400 });
  }

  return new Response(file.fileData, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${params.filename}"`,
    },
  });
}) satisfies APIRoute;
