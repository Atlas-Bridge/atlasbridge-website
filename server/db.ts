import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

let _pool: pg.Pool | undefined;
let _db: NodePgDatabase<typeof schema> | undefined;

export function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    _pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: process.env.VERCEL ? 3 : 10,
      idleTimeoutMillis: process.env.VERCEL ? 10000 : 30000,
    });
  }
  return _pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

// Backwards-compatible exports — accessed lazily via getters
export const pool = new Proxy({} as pg.Pool, {
  get(_, prop, receiver) {
    const target = getPool();
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_, prop, receiver) {
    const target = getDb();
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
