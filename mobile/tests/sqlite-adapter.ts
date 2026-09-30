import { DatabaseSync } from "node:sqlite";
import type { SqlAdapter } from "../src/data/adapter";
export function nodeAdapter(path: string): SqlAdapter {
  const db = new DatabaseSync(path);
  return {
    exec: async (sql) => {
      db.exec(sql);
    },
    run: async (sql, params = []) => {
      db.prepare(sql).run(...params);
    },
    all: async <T>(sql: string, params: (string | number | null)[] = []) =>
      db.prepare(sql).all(...params) as T[],
    close: async () => db.close(),
  };
}
