import type { TestUser } from "@/types/e2e";
import { hasBackend } from "./support/env";
import { expect, test } from "./support/fixtures";
import { createTestUser, deleteTestUser, requestFriendship } from "./support/users";

test.describe.configure({ mode: "serial" });

test.describe("friends", () => {
  test.skip(!hasBackend(), "Needs the Supabase backend.");
  let friend: TestUser;

  test.beforeAll(async () => {
    friend = await createTestUser("friend");
  });

  test.afterAll(async () => {
    await deleteTestUser(friend.id);
  });

  test("a received request can be accepted and shows in the leaderboard", async ({
    page,
    content,
    member,
  }) => {
    await requestFriendship(friend.id, member.id);
    await page.goto("/friends");
    await expect(content.getByRole("heading", { name: "Demandes reçues" })).toBeVisible();
    await content.getByRole("button", { name: "Accepter" }).click();
    await expect(content.getByRole("heading", { name: "Mes amis (1)" })).toBeVisible();
    const leaderboard = content.getByRole("list").filter({ hasText: "(vous)" });
    await expect(leaderboard.getByRole("listitem")).toHaveCount(2);
    await expect(leaderboard).toContainText(friend.username);
  });

  test("a friend can be removed", async ({ page, content }) => {
    await page.goto("/friends");
    await content.getByRole("button", { name: "Retirer" }).click();
    await expect(content.getByRole("heading", { name: /Mes amis/ })).toHaveCount(0);
  });

  test("a request can be sent by username, then cancelled", async ({ page, content }) => {
    await page.goto("/friends");
    await content.getByLabel("Pseudo de votre ami").fill("nobody_here_zz");
    await content.getByRole("button", { name: "Envoyer la demande" }).click();
    await expect(content.getByText("Aucun utilisateur ne porte ce pseudo.")).toBeVisible();

    await content.getByLabel("Pseudo de votre ami").fill(friend.username);
    await content.getByRole("button", { name: "Envoyer la demande" }).click();
    await expect(content.getByText(`Demande envoyée à ${friend.username}.`)).toBeVisible();
    await expect(content.getByRole("heading", { name: "Demandes envoyées" })).toBeVisible();
    await content.getByRole("button", { name: "Annuler" }).click();
    await expect(content.getByRole("heading", { name: "Demandes envoyées" })).toHaveCount(0);
  });
});
