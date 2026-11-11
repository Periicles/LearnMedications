import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonPlayerProps } from "@/types/quiz";
import type { SessionReward } from "@/types/progress";
import { TrackedLesson } from "./tracked-lesson";

const mocks = vi.hoisted(() => ({ completeSession: vi.fn(), playerProps: vi.fn() }));

vi.mock("../actions", () => ({ completeSession: mocks.completeSession }));
vi.mock("@/features/quiz/components/lesson-player", () => ({
  LessonPlayer: (props: LessonPlayerProps) => {
    mocks.playerProps(props);
    return <div data-testid="player">{props.summaryFooter}</div>;
  },
}));

const plan = { title: "Plan", cards: [], exercises: [] };
const context = { mode: "review" } as const;
const outcome = {
  records: [{ substanceSlug: "morphine", correct: true }],
  correctCount: 1,
  totalCount: 1,
  accuracy: 1,
  perfect: true,
};
const reward: SessionReward = {
  xpGained: 6,
  totalXp: 6,
  level: 1,
  leveledUp: false,
  streak: 1,
  streakExtended: true,
  badges: [],
};

function lastProps(): LessonPlayerProps {
  return mocks.playerProps.mock.calls.at(-1)![0];
}

beforeEach(() => vi.clearAllMocks());

describe("TrackedLesson", () => {
  it("passes the plan and exit link to the player", () => {
    render(<TrackedLesson plan={plan} exitHref="/review" context={context} />);
    expect(lastProps()).toMatchObject({ plan, exitHref: "/review" });
  });

  it("saves the records and shows the reward", async () => {
    mocks.completeSession.mockResolvedValue(reward);
    render(<TrackedLesson plan={plan} exitHref="/review" context={context} />);
    lastProps().onComplete?.(outcome);
    expect(await screen.findByText("+6")).toBeInTheDocument();
    expect(mocks.completeSession).toHaveBeenCalledWith({
      mode: "review",
      records: outcome.records,
    });
  });

  it("reports a failure when nothing is returned or the action throws", async () => {
    mocks.completeSession.mockResolvedValueOnce(null);
    render(<TrackedLesson plan={plan} exitHref="/review" context={context} />);
    lastProps().onComplete?.(outcome);
    expect(await screen.findByText(/n'ont pas pu être enregistrés/)).toBeInTheDocument();
    mocks.completeSession.mockRejectedValueOnce(new Error("network"));
    lastProps().onComplete?.(outcome);
    await waitFor(() => expect(mocks.completeSession).toHaveBeenCalledTimes(2));
    expect(screen.getByText(/n'ont pas pu être enregistrés/)).toBeInTheDocument();
  });
});
