import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Result = sqliteTable("result", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status", {
    enum: ["success", "error", "processing"],
  }).notNull(),
  twoStems: integer("two_stems", { mode: "boolean" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
});
