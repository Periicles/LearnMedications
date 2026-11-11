import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getCatalog, pickSubstances } from "@/features/content/lib/catalog";

vi.mock("next/server", () => ({ connection: vi.fn(async () => undefined) }));

import { connection } from "next/server";
import { DemoLesson } from "./demo-lesson";

describe("DemoLesson", () => {
  it("opens the first lesson of the first collection on its intro card", async () => {
    render(await DemoLesson());
    expect(connection).toHaveBeenCalled();
    const [lesson] = getCatalog().collections[0].lessons;
    const [first] = pickSubstances(lesson.substanceSlugs);
    expect(screen.getByRole("heading", { name: first.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quitter la leçon" })).toHaveAttribute("href", "/");
  });

  it("goes through the intro cards to the first exercise", async () => {
    render(await DemoLesson());
    const user = userEvent.setup();
    const [lesson] = getCatalog().collections[0].lessons;
    for (let step = 1; step < lesson.substanceSlugs.length; step += 1) {
      await user.click(screen.getByRole("button", { name: "Suivant" }));
    }
    await user.click(screen.getByRole("button", { name: "Commencer les exercices" }));
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByText(/Nouvelle molécule/)).not.toBeInTheDocument();
  });
});
