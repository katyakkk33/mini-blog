import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data.sqlite");
export const db = new Database(dbPath);

export function initDb() {
  const schemaPath = path.join(process.cwd(), "src", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);
}
