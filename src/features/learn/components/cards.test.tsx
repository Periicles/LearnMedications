import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { summarizeCollection } from "@/features/progress/lib/path";
import { CollectionCard } from "./collection-card";
import { CollectionSection } from "./collection-section";
import { ContinueCard } from "./continue-card";
import { ReviewCard } from "./review-card";

const [collection, other] = getCatalog().collections;
const fresh = summarizeCollection(collection, new Map());
const started = summarizeCollection(
  collection,
  new Map([[collection.slug, new Set([collection.lessons[0].key])]]),
);

describe("CollectionCard", () => {
  it("links to the collection with its progress", () => {
    render(<CollectionCard progress={started} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/learn/${collection.slug}`);
    expect(
      screen.getByText(new RegExp(`1/${collection.lessons.length} leçons`)),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  });
});

describe("CollectionSection", () => {
  it("lists a card per collection under its title", () => {
    render(
      <CollectionSection title="Parcours" items={[fresh, summarizeCollection(other, new Map())]} />,
    );
    expect(screen.getByRole("heading", { name: "Parcours" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("ContinueCard", () => {
  it("invites a new learner to start", () => {
    render(<ContinueCard progress={fresh} />);
    expect(screen.getByRole("link", { name: "Commencer" })).toHaveAttribute(
      "href",
      `/lesson/${collection.slug}/${collection.lessons[0].key}`,
    );
  });

  it("continues with the next lesson", () => {
    render(<ContinueCard progress={started} />);
    expect(screen.getByRole("link", { name: "Continuer" })).toBeInTheDocument();
  });

  it("renders nothing when the collection is finished", () => {
    const done = { ...started, nextLesson: null };
    const { container } = render(<ContinueCard progress={done} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("ReviewCard", () => {
  it("renders nothing without due molecules", () => {
    const { container } = render(<ReviewCard dueCount={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses the singular and the plural", () => {
    const { rerender } = render(<ReviewCard dueCount={1} />);
    expect(screen.getByText("1 molécule à réviser")).toBeInTheDocument();
    rerender(<ReviewCard dueCount={3} />);
    expect(screen.getByText("3 molécules à réviser")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Réviser" })).toHaveAttribute("href", "/lesson/review");
  });
});
