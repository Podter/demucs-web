import cron from "@elysiajs/cron";
import { eq, lt } from "drizzle-orm";

import { db } from "~/db/client";
import { Separation } from "~/db/schema";
import { getFilesPath } from "./file";

export async function removeSeparation(id: string) {
  await Promise.all([
    Bun.file(getFilesPath(id)).delete(),
    db.delete(Separation).where(eq(Separation.id, id)),
  ]);
}

// TODO: clean unreferenced files
export const cleanup = cron({
  name: "cleanup",
  pattern: "0 0 * * *", // Run every day at midnight
  run: async () => {
    const expired = await db
      .select({
        id: Separation.id,
      })
      .from(Separation)
      .where(lt(Separation.expiresAt, new Date()));

    if (expired.length > 0) {
      await Promise.all(
        expired.map(async ({ id }) => {
          await removeSeparation(id);
        }),
      );

      console.log(`Cleanup: deleted ${expired.length} expired separations`);
    }
  },
});
