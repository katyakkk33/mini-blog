import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

function resolveDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH;

  // Render: use a persistent disk mount if configured.
  // Recommended: attach a disk mounted at /var/data
  if (process.env.RENDER) {
    return path.join("/var/data", "data.sqlite");
  }

  // Local/dev default (in backend working directory)
  return path.join(process.cwd(), "data.sqlite");
}

const dbPath = resolveDbPath();
try {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
} catch (_) {}

export const db = new Database(dbPath);

export function initDb() {
  const schemaPath = path.join(process.cwd(), "src", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);
}
