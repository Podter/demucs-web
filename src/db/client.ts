import fs from "node:fs";
import path from "node:path";
import { Database } from "bun:sqlite";
import { pushSQLiteSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { env } from "~/env";
import * as schema from "./schema";

function createDb() {
  if (!fs.existsSync(env.DATA_DIR)) {
    fs.mkdirSync(env.DATA_DIR);
  }

  const dbPath = path.join(env.DATA_DIR, "data.db");
  const sqlite = new Database(dbPath, {
    strict: true,
    create: true,
  });

  sqlite.run("PRAGMA journal_mode = WAL;");

  const db = drizzle({ client: sqlite, schema });

  // @ts-expect-error - it's sqlite db
  pushSQLiteSchema(schema, db).then(async ({ hasDataLoss, apply }) => {
    if (hasDataLoss) {
      console.warn("Database migration ignored due to data loss");
      return;
    }
    await apply();
  });

  return db;
}

export const db = createDb();
