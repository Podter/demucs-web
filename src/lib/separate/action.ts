import { z } from "zod";

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

  console.log({
    ...input.data,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  return { success: true, id: crypto.randomUUID() };
}
