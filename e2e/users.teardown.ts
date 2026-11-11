import { existsSync, readFileSync } from "node:fs";
import { test as teardown } from "@playwright/test";
import type { StoredUsers } from "@/types/e2e";
import { USERS_FILE } from "./support/env";
import { deleteTestUser } from "./support/users";

teardown("delete the members created for this run", async () => {
  if (!existsSync(USERS_FILE)) return;
  const users = JSON.parse(readFileSync(USERS_FILE, "utf8")) as StoredUsers;
  for (const user of Object.values(users)) {
    await deleteTestUser(user.id);
  }
});
