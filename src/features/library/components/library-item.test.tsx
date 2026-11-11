import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LibraryEntry } from "@/types/library";
import { LibraryItem } from "./library-item";

const entry: LibraryEntry = {
  slug: "paracetamol",
  name: "Paracétamol",
  brands: ["Doliprane", "Dafalgan"],
  className: "Antalgiques",
  areaName: "Douleur",
  areaIcon: "💊",
  hint: "Antidouleur de palier 1",
  searchText: "paracetamol",
  strength: 3,
};

function renderItem(overrides: Partial<LibraryEntry>) {
  return render(
    <ul>
      <LibraryItem entry={{ ...entry, ...overrides }} />
    </ul>,
  );
}

describe("LibraryItem", () => {
  it("shows the molecule, brands, family, hint and mastery", () => {
    renderItem({});
    expect(screen.getByRole("heading", { name: "Paracétamol" })).toBeInTheDocument();
    expect(screen.getByText("Doliprane · Dafalgan")).toBeInTheDocument();
    expect(screen.getByText("💊 Antalgiques")).toBeInTheDocument();
    expect(screen.getByText("Antidouleur de palier 1")).toBeInTheDocument();
    expect(screen.getByText(/^Maîtrise 3\/\d+$/)).toBeInTheDocument();
  });

  it("hides the mastery badge and brands when there are none", () => {
    renderItem({ strength: null, brands: [] });
    expect(screen.queryByText(/Maîtrise/)).toBeNull();
    expect(screen.queryByText(/Doliprane/)).toBeNull();
  });
});
