import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormState } from "@/types/auth";
import { AvatarPicker } from "./avatar-picker";
import { DeleteAccount } from "./delete-account";
import { LogoutButton } from "./logout-button";
import { ProfileForm } from "./profile-form";

const mocks = vi.hoisted(() => ({ useActionState: vi.fn(), logout: vi.fn() }));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useActionState: mocks.useActionState,
}));
vi.mock("../actions", () => ({ updateProfile: vi.fn(), deleteAccount: vi.fn() }));
vi.mock("@/features/auth/actions", () => ({ logout: mocks.logout }));

function withState(state: FormState, isPending = false) {
  mocks.useActionState.mockReturnValue([state, vi.fn(), isPending]);
}

beforeEach(() => withState({ status: "idle" }));

describe("AvatarPicker", () => {
  it("offers every avatar and checks the selected one", async () => {
    render(<AvatarPicker selected="🧪" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(16);
    expect(screen.getByRole("radio", { name: "🧪" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "🦉" }));
    expect(screen.getByRole("radio", { name: "🦉" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "🧪" })).not.toBeChecked();
  });
});

describe("ProfileForm", () => {
  it("starts from the current profile", () => {
    render(<ProfileForm username="lea" avatar="🩺" />);
    expect(screen.getByLabelText("Pseudo")).toHaveValue("lea");
    expect(screen.getByRole("radio", { name: "🩺" })).toBeChecked();
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();
  });

  it("prefers echoed values and shows the feedback", () => {
    withState({
      status: "error",
      message: "Oups",
      fieldErrors: { username: "Ce pseudo est déjà pris." },
      values: { username: "bob", avatar: "🦊" },
    });
    render(<ProfileForm username="lea" avatar="🩺" />);
    expect(screen.getByLabelText("Pseudo")).toHaveValue("bob");
    expect(screen.getByRole("radio", { name: "🦊" })).toBeChecked();
    expect(screen.getByText("Ce pseudo est déjà pris.")).toBeInTheDocument();
    expect(screen.getByText("Oups")).toBeInTheDocument();
  });
});

describe("DeleteAccount", () => {
  it("asks to type the username and shows errors", () => {
    withState({ status: "error", fieldErrors: { confirmation: "Saisissez votre pseudo exact." } });
    render(<DeleteAccount username="lea" />);
    expect(screen.getByText("Supprimer mon compte")).toBeInTheDocument();
    expect(screen.getByText("lea", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("Saisissez votre pseudo exact.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Supprimer définitivement" })).toBeEnabled();
  });

  it("disables the button while deleting", () => {
    withState({ status: "idle" }, true);
    render(<DeleteAccount username="lea" />);
    expect(screen.getByRole("button", { name: "Supprimer définitivement" })).toBeDisabled();
  });
});

describe("LogoutButton", () => {
  it("renders a submit button inside a form", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Se déconnecter" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button.closest("form")).not.toBeNull();
  });
});
