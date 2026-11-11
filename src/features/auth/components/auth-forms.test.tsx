import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormState } from "@/types/auth";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SignupForm } from "./signup-form";

const mocks = vi.hoisted(() => ({ useActionState: vi.fn() }));

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useActionState: mocks.useActionState,
}));
vi.mock("../actions", () => ({
  login: vi.fn(),
  signup: vi.fn(),
  requestPasswordReset: vi.fn(),
  updatePassword: vi.fn(),
}));

function withState(state: FormState) {
  mocks.useActionState.mockReturnValue([state, vi.fn(), false]);
}

beforeEach(() => withState({ status: "idle" }));

describe("LoginForm", () => {
  it("renders the fields and the forgotten password link", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Adresse e-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toHaveAttribute("type", "password");
    expect(screen.getByRole("link", { name: "Mot de passe oublié ?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  it("restores the e-mail and shows errors", () => {
    withState({
      status: "error",
      message: "E-mail ou mot de passe incorrect.",
      fieldErrors: { password: "Mot de passe requis." },
      values: { email: "lea@example.com" },
    });
    render(<LoginForm />);
    expect(screen.getByLabelText("Adresse e-mail")).toHaveValue("lea@example.com");
    expect(screen.getByText("E-mail ou mot de passe incorrect.")).toBeInTheDocument();
    expect(screen.getByText("Mot de passe requis.")).toBeInTheDocument();
  });
});

describe("SignupForm", () => {
  it("renders the three fields", () => {
    render(<SignupForm />);
    for (const label of ["Pseudo", "Adresse e-mail", "Mot de passe"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Créer mon compte" })).toBeInTheDocument();
  });

  it("keeps submitted values and field errors", () => {
    withState({
      status: "error",
      fieldErrors: { username: "Ce pseudo est déjà pris." },
      values: { username: "lea", email: "lea@example.com" },
    });
    render(<SignupForm />);
    expect(screen.getByLabelText("Pseudo")).toHaveValue("lea");
    expect(screen.getByLabelText("Adresse e-mail")).toHaveValue("lea@example.com");
    expect(screen.getByText("Ce pseudo est déjà pris.")).toBeInTheDocument();
  });

  it("replaces the form by the confirmation message on success", () => {
    withState({ status: "success", message: "Vérifiez vos e-mails." });
    render(<SignupForm />);
    expect(screen.getByText("Vérifiez vos e-mails.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("ForgotPasswordForm", () => {
  it("renders the e-mail field with its error", () => {
    withState({ status: "error", fieldErrors: { email: "Adresse e-mail invalide." } });
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText("Adresse e-mail")).toBeInvalid();
    expect(screen.getByRole("button", { name: "Envoyer le lien" })).toBeInTheDocument();
  });

  it("shows only the confirmation on success", () => {
    withState({ status: "success", message: "Lien envoyé." });
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Lien envoyé.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Adresse e-mail")).toBeNull();
  });
});

describe("ResetPasswordForm", () => {
  it("renders both password fields and their errors", () => {
    withState({
      status: "error",
      fieldErrors: { confirmation: "Les mots de passe ne correspondent pas." },
    });
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText("Nouveau mot de passe")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmez le mot de passe")).toBeInvalid();
    expect(screen.getByText("Les mots de passe ne correspondent pas.")).toBeInTheDocument();
    expect(screen.getByText("Au moins 8 caractères.")).toBeInTheDocument();
  });
});
