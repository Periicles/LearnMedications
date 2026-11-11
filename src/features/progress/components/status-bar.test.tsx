import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Profile } from "@/types/progress";
import { toLocalDay } from "../lib/dates";
import { StatusBar } from "./status-bar";

const mocks = vi.hoisted(() => ({ getSessionUser: vi.fn(), getProfile: vi.fn() }));

vi.mock("@/features/auth/lib/session", () => ({ getSessionUser: mocks.getSessionUser }));
vi.mock("../lib/queries", () => ({ getProfile: mocks.getProfile }));

const profile: Profile = {
  id: "user-1",
  username: "lea",
  avatar: "pill",
  totalXp: 120,
  currentStreak: 4,
  longestStreak: 4,
  lastActiveOn: toLocalDay(new Date()),
  createdAt: "2026-01-01",
};

beforeEach(() => {
  mocks.getSessionUser.mockResolvedValue({ id: "user-1", email: "" });
  mocks.getProfile.mockResolvedValue(profile);
});

describe("StatusBar", () => {
  it("renders nothing for visitors and users without profile", async () => {
    mocks.getSessionUser.mockResolvedValue(null);
    expect((await StatusBar()) === null).toBe(true);
    mocks.getSessionUser.mockResolvedValue({ id: "user-1", email: "" });
    mocks.getProfile.mockResolvedValue(null);
    expect((await StatusBar()) === null).toBe(true);
  });

  it("shows streak, xp and level", async () => {
    render(await StatusBar());
    expect(screen.getByLabelText("Votre progression")).toBeInTheDocument();
    expect(screen.getByText("jours de série")).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByTitle("Niveau")).toHaveTextContent("2");
    expect(screen.getByTitle("Série de jours consécutifs")).toHaveClass("text-danger");
  });

  it("dims a lost streak and uses the singular", async () => {
    mocks.getProfile.mockResolvedValue({ ...profile, lastActiveOn: "2000-01-01" });
    render(await StatusBar());
    expect(screen.getByText("jour de série")).toBeInTheDocument();
    expect(screen.getByTitle("Série de jours consécutifs")).toHaveClass("text-ink-soft");
  });
});
