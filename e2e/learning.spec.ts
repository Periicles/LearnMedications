import { hasBackend } from "./support/env";
import { expect, expectNoSideScroll, test } from "./support/fixtures";
import { playLesson } from "./support/lesson";

test.describe.configure({ mode: "serial" });

test.describe("learning", () => {
  test.skip(!hasBackend(), "Needs the Supabase backend.");

  test("a finished lesson earns XP, a streak and unlocks the next lesson", async ({
    page,
    content,
  }) => {
    await page.goto("/learn/essentials");
    await content.getByRole("link").filter({ hasText: "À vous de jouer" }).click();
    await expect(page).toHaveURL(/\/lesson\/essentials\//);
    await playLesson(page);
    await expect(content.getByText("Sans faute !")).toBeVisible();
    await expect(content.getByText("XP gagnés")).toBeVisible();
    await expect(content.getByText(/^1 jour$/)).toBeVisible();
    await expectNoSideScroll(page);

    await content.getByRole("link", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/\/learn\/essentials$/);
    await expect(content.getByText("Terminée · refaire").first()).toBeVisible();
    await expect(content.getByText("À vous de jouer")).toHaveCount(1);
  });

  test("progress shows in the status bar, achievements and profile", async ({ page, content }) => {
    await page.goto("/achievements");
    await expect(content.getByText(/Débloqué le/).first()).toBeVisible();
    await expect(content.getByRole("heading", { name: "Premier pas" })).toBeVisible();
    const statusBar = page.getByRole("list", { name: "Votre progression" });
    await expect(statusBar).not.toContainText(/^0 /);

    await page.goto("/profile");
    await expect(content.getByText("Leçons terminées")).toBeVisible();
    await expect(content.getByText("Maîtrise par spécialité")).toBeVisible();
    await expectNoSideScroll(page);
  });

  test("a review session practises the molecules already seen", async ({ page, content }) => {
    await page.goto("/review");
    await expect(content.getByText("molécules rencontrées")).toBeVisible();
    await content.getByRole("link", { name: /S'entraîner|Lancer la révision/ }).click();
    await expect(page).toHaveURL(/\/lesson\/review$/);
    await playLesson(page, { mistakes: 1 });
    await expect(content.getByText("XP gagnés")).toBeVisible();
    await content.getByRole("link", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/\/review$/);
  });

  test("the library finds a molecule from its brand name", async ({ page, content }) => {
    await page.goto("/library");
    await content.getByRole("searchbox").fill("doliprane");
    await expect(content.getByRole("heading", { name: "Paracétamol", exact: true })).toBeVisible();
    await content.getByRole("searchbox").fill("zzzzzz");
    await expect(content.getByText("0 molécule")).toBeVisible();
    await expectNoSideScroll(page);
  });
});
