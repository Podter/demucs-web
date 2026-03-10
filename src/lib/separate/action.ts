import path from "node:path";
import { DEMUCS_COG_URL } from "astro:env/server";
import { z } from "zod";

import { generateId } from "../id";
import { saveSeparationData, saveSeparationFile } from "../redis";
import { SEPARATION_MODE, SEPARATION_SPEED } from "./options";

type SeparateResult =
  | { success: true; id: string }
  | { success: false; error: string };

const SeparationInputSchema = z.object({
  mode: z.enum(SEPARATION_MODE.map(({ value }) => value)),
  speed: z.enum(SEPARATION_SPEED.map(({ value }) => value)),
});

export async function separate(req: Request): Promise<SeparateResult> {
  const formData = await req.formData();

  const input = SeparationInputSchema.safeParse({
    mode: formData.get("mode"),
    speed: formData.get("speed"),
  });

  if (!input.success) {
    return {
      success: false,
      error: "Invalid input. Please select valid separation mode and speed.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file uploaded" };
  }

  if (!file.type.startsWith("audio/")) {
    return {
      success: false,
      error: "Invalid file type. Please upload an audio file.",
    };
  }

  const { origin } = new URL(req.url);
  const { id, idHmacBase64 } = generateId();

  await saveSeparationData(id, {
    mode: input.data.mode,
    speed: input.data.speed,
    files: {},
    status: "starting",
    logs: "",
  });
  await saveSeparationFile(
    id,
    `original${path.extname(file.name)}`,
    file.type,
    new Uint8Array(await file.arrayBuffer()),
  );

  const res = await fetch(`${DEMUCS_COG_URL}/predictions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Prefer: "respond-async",
    },
    body: JSON.stringify({
      input: {
        id: idHmacBase64,
        audio_file: `${origin}/api/${idHmacBase64}/file/original${path.extname(file.name)}`,
        model_name:
          input.data.mode === "6_stems"
            ? "htdemucs6"
            : input.data.speed === "high_quality"
              ? "htdemucs_ft"
              : "htdemucs",
      },
      webhook: `${origin}/api/webhooks/${idHmacBase64}`,
      webhook_events_filter: ["start", "logs", "completed"],
    }),
  });

  if (!res.ok) {
    console.error("Failed to start separation:", await res.json());
    return {
      success: false,
      error: "Failed to start separation. Please try again later.",
    };
  }

  return { success: true, id };
}
