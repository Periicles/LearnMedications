import { readFileSync } from "node:fs";
import { expect, test as base } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { AppFixtures, StoredUsers } from "@/types/e2e";
import { USERS_FILE } from "./env";

export const test = base.extend<AppFixtures>({
  content: async ({ page }, use) => {
    await use(page.locator("main:visible"));
  },
  member: async ({}, use, testInfo) => {
    const users = JSON.parse(readFileSync(USERS_FILE, "utf8")) as StoredUsers;
    await use(users[testInfo.project.name]);
  },
});

export { expect };

/** Fails when the page can be scrolled sideways, which breaks phone layouts. */
export async function expectNoSideScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
}
