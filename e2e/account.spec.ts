import type { TestUser } from "@/types/e2e";
import { hasBackend } from "./support/env";
import { expect, login, test } from "./support/fixtures";
import { createTestUser, deleteTestUser } from "./support/users";

const LOGOUT_PROJECTS = ["Desktop Chrome", "iPhone 16"];

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("account", () => {
  test.skip(!hasBackend(), "Needs the Supabase backend.");
  let owner: TestUser;

  test.beforeEach(async () => {
    owner = await createTestUser("owner");
  });

  test.afterEach(async () => {
    await deleteTestUser(owner.id);
  });

  test("login, profile edition and account deletion", async ({ page, content }) => {
    await login(page, owner.email, "wrong-password");
    await expect(content.getByText("E-mail ou mot de passe incorrect.")).toBeVisible();
    await expect(page.getByLabel("Adresse e-mail")).toHaveValue(owner.email);

    await page.getByLabel("Mot de passe").fill(owner.password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(content.getByRole("heading", { level: 1 })).toContainText(owner.username);

    await page.goto("/profile");
    await content.getByText("🩺").click();
    await content.getByRole("button", { name: "Enregistrer" }).click();
    await expect(content.getByText("Profil mis à jour.")).toBeVisible();

    await content.getByText("Supprimer mon compte").click();
    await content.getByLabel("Votre pseudo").fill("someone_else");
    await content.getByRole("button", { name: "Supprimer définitivement" }).click();
    await expect(content.getByText("Saisissez votre pseudo exact.")).toBeVisible();
    await content.getByLabel("Votre pseudo").fill(owner.username);
    await content.getByRole("button", { name: "Supprimer définitivement" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/learn");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("logout ends the session", async ({ page, content }, testInfo) => {
    test.skip(!LOGOUT_PROJECTS.includes(testInfo.project.name), "Covered on two projects.");
    await login(page, owner.email, owner.password);
    await expect(page).toHaveURL(/\/learn$/);
    await page.goto("/profile");
    await content.getByRole("button", { name: "Se déconnecter" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/learn");
    await expect(page).toHaveURL(/\/login$/);
  });
});
