import cron from "@elysiajs/cron";
import { eq, lt } from "drizzle-orm";

import { db } from "~/db/client";
import { Result } from "~/db/schema";
import { getFilesPath } from "./file";

export async function deleteResult(id: string) {
  await Promise.all([
    Bun.file(getFilesPath(id)).delete(),
    db.delete(Result).where(eq(Result.id, id)),
  ]);
}

// TODO: clean unreferenced files
export const cleanup = cron({
  name: "cleanup",
  pattern: "0 0 * * *", // Run every day at midnight
  run: async () => {
    const expired = await db
      .select({
        id: Result.id,
      })
      .from(Result)
      .where(lt(Result.expiresAt, new Date()));

    if (expired.length > 0) {
      await Promise.all(
        expired.map(async ({ id }) => {
          await deleteResult(id);
        }),
      );

      console.log(`Cleanup: deleted ${expired.length} expired results`);
    }
  },
});
