import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { TrackedLessonProps } from "@/types/progress";
import { LessonScreen } from "./lesson-screen";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getCompletions: vi.fn(),
  tracked: vi.fn(),
}));

vi.mock("@/features/auth/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/features/progress/lib/queries", () => ({ getCompletions: mocks.getCompletions }));
vi.mock("@/features/progress/components/tracked-lesson", () => ({
  TrackedLesson: (props: TrackedLessonProps) => {
    mocks.tracked(props);
    return <p>tracked lesson</p>;
  },
}));

const [collection] = getCatalog().collections;
const [lesson, secondLesson] = collection.lessons;

function paramsFor(lessonKey: string) {
  return Promise.resolve({ collection: collection.slug, lesson: lessonKey });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireUser.mockResolvedValue({ id: "user-1", email: "" });
  mocks.getCompletions.mockResolvedValue(new Map());
});

describe("LessonScreen", () => {
  it("renders the tracked lesson for an unlocked lesson", async () => {
    render(await LessonScreen({ params: paramsFor(lesson.key) }));
    expect(screen.getByText("tracked lesson")).toBeInTheDocument();
    expect(mocks.tracked.mock.calls[0][0]).toMatchObject({
      exitHref: `/learn/${collection.slug}`,
      context: { mode: "learn", collectionSlug: collection.slug, lessonKey: lesson.key },
      plan: { title: lesson.title },
    });
  });

  it("returns a 404 for unknown collections and lessons", async () => {
    await expect(LessonScreen({ params: paramsFor("missing") })).rejects.toThrow("NEXT_NOT_FOUND");
    const unknown = Promise.resolve({ collection: "missing", lesson: lesson.key });
    await expect(LessonScreen({ params: unknown })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("sends the learner back to the collection when the lesson is locked", async () => {
    await expect(LessonScreen({ params: paramsFor(secondLesson.key) })).rejects.toThrow(
      `NEXT_REDIRECT:/learn/${collection.slug}`,
    );
  });
});
