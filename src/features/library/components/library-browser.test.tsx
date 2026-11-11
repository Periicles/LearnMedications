import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { buildLibraryEntries, LIBRARY_PAGE_SIZE } from "../lib/entries";
import { LibraryBrowser } from "./library-browser";

const entries = buildLibraryEntries(getCatalog(), []);

describe("LibraryBrowser", () => {
  it("shows a first page and the molecule count", () => {
    render(<LibraryBrowser entries={entries} />);
    expect(screen.getByRole("status")).toHaveTextContent(`${entries.length} molécules`);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(LIBRARY_PAGE_SIZE);
  });

  it("reveals more molecules with the show more button", async () => {
    render(<LibraryBrowser entries={entries} />);
    await userEvent.click(screen.getByRole("button", { name: "Afficher plus" }));
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      Math.min(entries.length, LIBRARY_PAGE_SIZE * 2),
    );
  });

  it("filters while typing and resets pagination", async () => {
    render(<LibraryBrowser entries={entries} />);
    await userEvent.click(screen.getByRole("button", { name: "Afficher plus" }));
    await userEvent.type(screen.getByRole("searchbox"), "doliprane");
    expect(await screen.findByText("Paracétamol")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/^\d+ molécules?$/);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeLessThan(LIBRARY_PAGE_SIZE);
    expect(screen.queryByRole("button", { name: "Afficher plus" })).toBeNull();
  });

  it("uses the singular for one match and an empty state for none", async () => {
    const single = entries.filter((entry) => entry.slug === "paracetamol");
    render(<LibraryBrowser entries={single} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 molécule");
    await userEvent.type(screen.getByRole("searchbox"), "zzzz");
    expect(await screen.findByText("0 molécule")).toBeInTheDocument();
    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
  });
});
