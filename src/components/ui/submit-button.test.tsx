import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitButton } from "./submit-button";

const mocks = vi.hoisted(() => ({ useFormStatus: vi.fn() }));

vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  useFormStatus: mocks.useFormStatus,
}));

beforeEach(() => {
  mocks.useFormStatus.mockReturnValue({ pending: false });
});

describe("SubmitButton", () => {
  it("shows its label and is enabled when idle", () => {
    render(<SubmitButton>Envoyer</SubmitButton>);
    const button = screen.getByRole("button", { name: "Envoyer" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("is disabled with the default pending label while submitting", () => {
    mocks.useFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton>Envoyer</SubmitButton>);
    expect(screen.getByRole("button", { name: "Un instant…" })).toBeDisabled();
  });

  it("accepts a custom pending label", () => {
    mocks.useFormStatus.mockReturnValue({ pending: true });
    render(<SubmitButton pendingLabel="Envoi…">Envoyer</SubmitButton>);
    expect(screen.getByRole("button", { name: "Envoi…" })).toBeDisabled();
  });
});
