import type { AppAPI } from "backend/src/types";
import { treaty } from "@elysiajs/eden";

export const client = treaty<AppAPI>("localhost:3000");
