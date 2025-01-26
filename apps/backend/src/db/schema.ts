import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Separation = sqliteTable("separation", {
  id: text("id").primaryKey(),
  status: text("status", {
    enum: ["success", "error", "processing"],
  }).notNull(),
  twoStems: integer("two_stems", { mode: "boolean" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
});
