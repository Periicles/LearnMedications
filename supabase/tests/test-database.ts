import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { TestDatabase } from "@/types/database-test";

const TESTS_DIR = join(process.cwd(), "supabase", "tests");
const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

/** Boots an in-memory Postgres with Supabase stubs and every migration applied. */
export async function createTestDatabase(): Promise<TestDatabase> {
  const database = new PGlite();
  await database.exec(readFileSync(join(TESTS_DIR, "stubs.sql"), "utf8"));
  for (const fileName of readdirSync(MIGRATIONS_DIR).sort()) {
    await database.exec(readFileSync(join(MIGRATIONS_DIR, fileName), "utf8"));
  }

  const createUser = async (username: string): Promise<string> => {
    const result = await database.query<Record<"id", string>>(
      "insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id",
      [`${username}@example.com`, { username }],
    );
    return result.rows[0].id;
  };

  const runAsUser = async <Row>(userId: string, statement: string): Promise<Row[]> => {
    await database.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub', '${userId}', false);`,
    );
    try {
      return (await database.query<Row>(statement)).rows;
    } finally {
      await database.exec("reset role");
    }
  };

  return { database, createUser, runAsUser };
}
