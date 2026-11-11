import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormState } from "@/types/auth";
import type { FriendSummary, LeaderboardEntry } from "@/types/social";
import { AddFriendForm } from "./add-friend-form";
import { FriendAction } from "./friend-action";
import { FriendList } from "./friend-list";
import { Leaderboard } from "./leaderboard";
import { PersonRow } from "./person-row";
import { RequestList } from "./request-list";

const mocks = vi.hoisted(() => ({ useActionState: vi.fn() }));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useActionState: mocks.useActionState,
}));
vi.mock("../actions", () => ({
  sendFriendRequest: vi.fn(),
  acceptFriendRequest: vi.fn(),
  removeFriendship: vi.fn(),
}));

const friendBob: FriendSummary = { id: "u2", username: "bob", avatar: "🧪", level: 3 };
const carol: FriendSummary = { id: "u3", username: "carol", avatar: "🦊", level: 1 };

function withState(state: FormState) {
  mocks.useActionState.mockReturnValue([state, vi.fn(), false]);
}

beforeEach(() => withState({ status: "idle" }));

describe("AddFriendForm", () => {
  it("renders the form and the echoed value and error", () => {
    withState({
      status: "error",
      fieldErrors: { username: "3 à 20 caractères" },
      values: { username: "bo" },
    });
    render(<AddFriendForm />);
    expect(screen.getByLabelText("Pseudo de votre ami")).toHaveValue("bo");
    expect(screen.getByText("3 à 20 caractères")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoyer la demande" })).toBeInTheDocument();
  });

  it("shows the success message", () => {
    withState({ status: "success", message: "Demande envoyée à bob." });
    render(<AddFriendForm />);
    expect(screen.getByText("Demande envoyée à bob.")).toBeInTheDocument();
  });
});

describe("FriendAction", () => {
  it("posts the friend id through the given action", async () => {
    const action = vi.fn(async () => undefined);
    render(<FriendAction friendId="u2" label="Retirer" variant="ghost" action={action} />);
    await userEvent.click(screen.getByRole("button", { name: "Retirer" }));
    expect(action).toHaveBeenCalledTimes(1);
    const submitted = (action.mock.calls[0] as unknown as [FormData])[0];
    expect(submitted.get("friendId")).toBe("u2");
  });
});

describe("PersonRow", () => {
  it("shows the person and its actions", () => {
    render(
      <ul>
        <PersonRow person={friendBob}>
          <button>Action</button>
        </PersonRow>
      </ul>,
    );
    expect(screen.getByText("bob")).toBeInTheDocument();
    expect(screen.getByText("Niveau 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});

describe("RequestList", () => {
  it("renders nothing without people", () => {
    const { container } = render(<RequestList title="Reçues" people={[]} kind="received" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("offers accept and decline for received requests", () => {
    render(<RequestList title="Demandes reçues" people={[friendBob]} kind="received" />);
    expect(screen.getByRole("heading", { name: "Demandes reçues" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accepter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument();
  });

  it("only offers to cancel sent requests", () => {
    render(<RequestList title="Envoyées" people={[friendBob, carol]} kind="sent" />);
    expect(screen.queryByRole("button", { name: "Accepter" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Annuler" })).toHaveLength(2);
  });
});

describe("FriendList", () => {
  it("renders nothing without friends", () => {
    const { container } = render(<FriendList friends={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists friends with a remove button", () => {
    render(<FriendList friends={[friendBob, carol]} />);
    expect(screen.getByRole("heading", { name: "Mes amis (2)" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Retirer" })).toHaveLength(2);
  });
});

describe("Leaderboard", () => {
  const entry = (overrides: Partial<LeaderboardEntry>): LeaderboardEntry => ({
    id: "u1",
    rank: 1,
    username: "lea",
    avatar: "💊",
    level: 2,
    streak: 3,
    weeklyXp: 80,
    isSelf: false,
    ...overrides,
  });

  it("shows medals, the current user and plural streaks", () => {
    render(
      <Leaderboard
        entries={[
          entry({}),
          entry({ id: "u2", rank: 2, username: "bob", streak: 1, isSelf: true }),
          entry({ id: "u3", rank: 4, username: "dan", streak: 0 }),
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByText("🥇")).toBeInTheDocument();
    expect(within(items[0]).getByText("80 XP")).toBeInTheDocument();
    expect(within(items[0]).getByText("jours de série")).toBeInTheDocument();
    expect(within(items[1]).getByText("bob (vous)")).toBeInTheDocument();
    expect(within(items[1]).getByText("🥈")).toBeInTheDocument();
    expect(within(items[1]).getByText("jour de série")).toBeInTheDocument();
    expect(within(items[2]).getByText("4")).toBeInTheDocument();
    expect(within(items[2]).getByText("jour de série")).toBeInTheDocument();
  });
});
