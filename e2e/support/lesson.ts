import type { Locator, Page } from "@playwright/test";
import type { ContentIndex, PlayOptions } from "@/types/e2e";
import { isRightChoice, loadContentIndex } from "./content";

const contentIndex = loadContentIndex();
const MAX_STEPS = 80;

async function readText(locator: Locator): Promise<string> {
  return ((await locator.textContent()) ?? "").trim();
}

async function skipIntro(content: Locator): Promise<void> {
  const nextCard = content.getByRole("button", { name: /^Suivant$|Commencer les exercices/ });
  await content.locator("h1").first().waitFor();
  while ((await nextCard.count()) > 0) {
    await nextCard.click();
  }
}

async function matchPairs(content: Locator, index: ContentIndex): Promise<void> {
  const columns = content.locator("ul");
  const leftTiles = columns.nth(0).getByRole("button");
  const rightTiles = columns.nth(1).getByRole("button");
  const pairCount = await leftTiles.count();
  for (let position = 0; position < pairCount; position += 1) {
    const name = await readText(leftTiles.nth(position));
    const accepted = [...(index.brandsByName.get(name) ?? []), index.hintByName.get(name)];
    await leftTiles.nth(position).click();
    const labels = await rightTiles.allTextContents();
    const target = labels.findIndex((label) => accepted.includes(label.trim()));
    await rightTiles.nth(target).click();
  }
}

async function answerChoice(content: Locator, prompt: string, wantWrong: boolean): Promise<void> {
  const subject = await readText(content.locator("p.text-center").first());
  const buttons = content.locator("ul").getByRole("button");
  const labels = await buttons.locator("span:last-child").allTextContents();
  const target = labels.findIndex(
    (label) => isRightChoice(contentIndex, prompt, subject, label.trim()) !== wantWrong,
  );
  await buttons.nth(Math.max(target, 0)).click();
}

/** Plays the lesson on screen until its summary, answering correctly unless told otherwise. */
export async function playLesson(page: Page, options: PlayOptions = {}): Promise<void> {
  const content = page.locator("main:visible");
  let mistakesLeft = options.mistakes ?? 0;
  await skipIntro(content);

  for (let step = 0; step < MAX_STEPS; step += 1) {
    if ((await content.getByText("Précision").count()) > 0) return;
    const prompt = await readText(content.locator("h1").first());
    if (prompt.includes("Associez")) {
      await matchPairs(content, contentIndex);
    } else if (prompt.includes("Écrivez")) {
      const brand = await readText(content.locator("form p").first());
      await content.getByLabel("Votre réponse").fill(contentIndex.nameByBrand.get(brand) ?? "");
      await content.getByRole("button", { name: "Valider" }).click();
    } else {
      await answerChoice(content, prompt, mistakesLeft > 0);
      mistakesLeft = Math.max(mistakesLeft - 1, 0);
    }
    await page.getByRole("button", { name: "Continuer" }).click();
  }
  throw new Error("The lesson did not reach its summary.");
}
