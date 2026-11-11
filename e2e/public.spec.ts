import { hasBackend } from "./support/env";
import { expect, expectNoSideScroll, test } from "./support/fixtures";
import { playLesson } from "./support/lesson";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("public pages", () => {
  test("landing page presents the app and its entry points", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Apprenez les médicaments");
    await expect(page.getByRole("link", { name: "Commencer gratuitement" })).toHaveAttribute(
      "href",
      "/signup",
    );
    await expect(page.getByRole("link", { name: "Essayer une leçon" })).toBeVisible();
    await expect(page.getByText("Outil pédagogique")).toBeVisible();
    await expectNoSideScroll(page);
  });

  test("demo lesson can be played to the end without an account", async ({ page, content }) => {
    await page.goto("/demo");
    await playLesson(page, { mistakes: 1 });
    await expect(content.getByText("Bonnes réponses")).toBeVisible();
    await expect(content.getByRole("link", { name: "Créer mon compte" })).toBeVisible();
    await expectNoSideScroll(page);
  });

  test("web app manifest makes the app installable", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBe(true);
    const manifest = await response.json();
    expect(manifest).toMatchObject({ display: "standalone", start_url: "/learn", lang: "fr" });
    expect((await request.get(manifest.icons[0].src)).ok()).toBe(true);
  });

  test("guests are sent to the login page", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Bon retour !" })).toBeVisible();
  });

  test("sign-up form validates its fields and keeps what was typed", async ({ page, content }) => {
    await page.goto("/signup");
    await page.getByLabel("Pseudo").fill("valid_name");
    await page.getByLabel("Adresse e-mail").fill("pas-un-email");
    await page.getByLabel("Mot de passe").fill("court");
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(content.getByText("Adresse e-mail invalide.")).toBeVisible();
    await expect(content.getByText("au moins 8 caractères.").last()).toBeVisible();
    await expect(page.getByLabel("Pseudo")).toHaveValue("valid_name");
    await expectNoSideScroll(page);
  });

  test("sign-up refuses a username that is already taken", async ({ page, content, member }) => {
    test.skip(!hasBackend(), "Needs the Supabase backend.");
    await page.goto("/signup");
    await page.getByLabel("Pseudo").fill(member.username);
    await page.getByLabel("Adresse e-mail").fill("e2e-unused@learnmedications.test");
    await page.getByLabel("Mot de passe").fill("E2e-password-2026");
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(content.getByText("Ce pseudo est déjà pris.")).toBeVisible();
  });
});
