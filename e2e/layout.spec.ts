import { hasBackend } from "./support/env";
import { expect, expectNoSideScroll, test } from "./support/fixtures";

const DESKTOP_WIDTH = 1024;
const PAGES = [
  { path: "/learn", heading: /Bonjour/ },
  { path: "/learn/service-emergency", heading: /Urgences et SMUR/ },
  { path: "/library", heading: "Lexique" },
  { path: "/friends", heading: "Amis" },
  { path: "/achievements", heading: "Succès" },
  { path: "/profile", heading: /e2e_member/ },
];

test.describe("signed-in layout", () => {
  test.skip(!hasBackend(), "Needs the Supabase backend.");

  for (const { path, heading } of PAGES) {
    test(`${path} fits the screen`, async ({ page, content }) => {
      await page.goto(path);
      await expect(content.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expectNoSideScroll(page);
    });
  }

  test("navigation adapts to the screen size and switches pages", async ({ page }) => {
    await page.goto("/learn");
    const isDesktop = (page.viewportSize()?.width ?? 0) >= DESKTOP_WIDTH;
    const sidebar = page.getByRole("complementary");
    const tabBar = page.locator("nav.fixed");
    await expect(sidebar).toBeVisible({ visible: isDesktop });
    await expect(tabBar).toBeVisible({ visible: !isDesktop });

    const navigation = isDesktop ? sidebar : tabBar;
    await navigation.getByRole("link", { name: "Amis" }).click();
    await expect(page).toHaveURL(/\/friends$/);
    await expect(navigation.getByRole("link", { name: "Amis" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await navigation.getByRole("link", { name: "Leçons" }).click();
    await expect(page).toHaveURL(/\/learn$/);
  });
});
