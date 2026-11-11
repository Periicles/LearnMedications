import { act, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MATCH_EXERCISE } from "@/testing/quiz-fixtures";
import { useKeyPress } from "./use-key-press";
import { useMatchBoard } from "./use-match-board";

describe("useKeyPress", () => {
  it("forwards pressed keys until unmounted, using the latest handler", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(({ handler }) => useKeyPress(handler), {
      initialProps: { handler: first },
    });
    await userEvent.keyboard("a");
    rerender({ handler: second });
    await userEvent.keyboard("b");
    expect(first).toHaveBeenCalledWith("a");
    expect(second).toHaveBeenCalledWith("b");
    unmount();
    await userEvent.keyboard("c");
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe("useMatchBoard", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("tracks tile states through a wrong pair and a right pair", () => {
    const onAnswer = vi.fn();
    const { result } = renderHook(() => useMatchBoard(MATCH_EXERCISE, onAnswer));
    act(() => result.current.pick("left", "Aspirine"));
    expect(result.current.tileState("left", "Aspirine")).toBe("selected");
    act(() => result.current.pick("right", "Contramal"));
    expect(result.current.tileState("right", "Contramal")).toBe("wrong");
    expect(result.current.tileState("left", "Aspirine")).toBe("wrong");
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.tileState("right", "Contramal")).toBe("idle");
    act(() => result.current.pick("left", "Aspirine"));
    act(() => result.current.pick("right", "Aspégic"));
    expect(result.current.tileState("right", "Aspégic")).toBe("matched");
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("ignores an unknown left label", () => {
    const onAnswer = vi.fn();
    const { result } = renderHook(() => useMatchBoard(MATCH_EXERCISE, onAnswer));
    act(() => result.current.pick("left", "Inconnu"));
    act(() => result.current.pick("right", "Aspégic"));
    expect(onAnswer).not.toHaveBeenCalled();
    expect(result.current.tileState("right", "Aspégic")).toBe("idle");
  });
});
