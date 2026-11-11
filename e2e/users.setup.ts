import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { expect, test as setup } from "@playwright/test";
import type { StoredUsers } from "@/types/e2e";
import { hasBackend, storageFile, USERS_FILE } from "./support/env";
import { login } from "./support/fixtures";
import { createTestUser } from "./support/users";

const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] });

setup("create one signed-in member per browser project", async ({ browser }, testInfo) => {
  setup.setTimeout(240_000);
  const deviceNames = testInfo.config.projects
    .map((project) => project.name)
    .filter((projectName) => !["setup", "cleanup"].includes(projectName));
  const users: StoredUsers = {};
  mkdirSync(dirname(USERS_FILE), { recursive: true });

  if (!hasBackend()) {
    // Public pages can still be tested: every project starts as a guest.
    deviceNames.forEach((deviceName) => writeFileSync(storageFile(deviceName), EMPTY_STATE));
    writeFileSync(USERS_FILE, "{}");
    return;
  }

  for (const [position, deviceName] of deviceNames.entries()) {
    const user = await createTestUser(`member${position}`);
    users[deviceName] = user;
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
    const page = await context.newPage();
    await login(page, user.email, user.password);
    await expect(page).toHaveURL(/\/learn$/);
    await context.storageState({ path: storageFile(deviceName) });
    await context.close();
  }
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
});
