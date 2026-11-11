import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { buildLessonNodes } from "@/features/progress/lib/path";
import { LessonNodeView } from "./lesson-node";
import { LessonPath } from "./lesson-path";

const catalog = getCatalog();
const collection = catalog.collections.find((candidate) => candidate.lessons.length >= 2)!;
const nodes = buildLessonNodes(
  collection,
  new Map([[collection.slug, new Set([collection.lessons[0].key])]]),
  catalog.areas,
);

describe("LessonNodeView", () => {
  it("links a completed lesson to replay it", () => {
    render(<LessonNodeView node={nodes[0]} href="/lesson/a" position={1} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/lesson/a");
    expect(screen.getByText(/Terminée · refaire/)).toBeInTheDocument();
  });

  it("shows the position of the current lesson", () => {
    render(<LessonNodeView node={nodes[1]} href="/lesson/b" position={2} />);
    expect(screen.getByRole("link")).toHaveTextContent("2");
    expect(screen.getByText(/À vous de jouer/)).toBeInTheDocument();
  });

  it("does not link a locked lesson", () => {
    render(<LessonNodeView node={{ ...nodes[1], status: "locked" }} href="/x" position={2} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Terminez la leçon précédente/)).toBeInTheDocument();
  });
});

describe("LessonPath", () => {
  it("renders every lesson and a heading when the area changes", () => {
    render(<LessonPath collectionSlug={collection.slug} nodes={nodes} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(nodes.length);
    const areaCount = nodes.filter(
      (node, index) => index === 0 || nodes[index - 1].areaName !== node.areaName,
    ).length;
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(areaCount);
  });
});
