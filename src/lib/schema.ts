import z from "zod";

import { SEPARATION_MODE, SEPARATION_SPEED } from "./separate/options";

export const SeparationStatusEnum = z.enum([
  "starting",
  "processing",
  "succeeded",
  "canceled",
  "failed",
]);

export const SeparationDataSchema = z.object({
  mode: z.enum(SEPARATION_MODE.map((option) => option.value)),
  speed: z.enum(SEPARATION_SPEED.map((option) => option.value)),
  files: z.record(z.string(), z.string()),
  status: SeparationStatusEnum,
  logs: z.string(),
});

export type SeparationData = z.infer<typeof SeparationDataSchema>;
