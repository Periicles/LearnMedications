import type { PGlite } from "@electric-sql/pglite";

export interface TestDatabase {
  database: PGlite;
  /** Creates an auth user (which triggers profile creation) and returns its id. */
  createUser: (username: string) => Promise<string>;
  /** Runs statements as the given signed-in user, with row level security applied. */
  runAsUser: <Row>(userId: string, statement: string) => Promise<Row[]>;
}
