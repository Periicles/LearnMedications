import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { TrackedLessonProps } from "@/types/progress";
import { ReviewScreen } from "./review-screen";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getMasteryRows: vi.fn(),
  tracked: vi.fn(),
}));

vi.mock("@/features/auth/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/features/progress/lib/queries", () => ({ getMasteryRows: mocks.getMasteryRows }));
vi.mock("@/features/progress/components/tracked-lesson", () => ({
  TrackedLesson: (props: TrackedLessonProps) => {
    mocks.tracked(props);
    return <p>tracked review</p>;
  },
}));

const [slug] = [...getCatalog().substances.keys()];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireUser.mockResolvedValue({ id: "user-1", email: "" });
});

describe("ReviewScreen", () => {
  it("starts a review of the weakest known substances", async () => {
    mocks.getMasteryRows.mockResolvedValue([
      {
        substanceSlug: slug,
        strength: 1,
        correctCount: 0,
        wrongCount: 1,
        nextReviewAt: "2999-01-01",
      },
    ]);
    render(await ReviewScreen());
    expect(screen.getByText("tracked review")).toBeInTheDocument();
    expect(mocks.tracked.mock.calls[0][0]).toMatchObject({
      exitHref: "/review",
      context: { mode: "review" },
      plan: { title: "Révision" },
    });
  });

  it("goes back to the review page when there is nothing to review", async () => {
    mocks.getMasteryRows.mockResolvedValue([]);
    await expect(ReviewScreen()).rejects.toThrow("NEXT_REDIRECT:/review");
  });
});
