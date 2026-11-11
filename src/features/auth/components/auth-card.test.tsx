import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthCard } from "./auth-card";

describe("AuthCard", () => {
  it("renders the heading, subtitle, content and footer", () => {
    render(
      <AuthCard title="Connexion" subtitle="Bon retour" footer={<a href="/signup">Créer</a>}>
        <p>Formulaire</p>
      </AuthCard>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByText("Bon retour")).toBeInTheDocument();
    expect(screen.getByText("Formulaire")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer" })).toBeInTheDocument();
  });

  it("omits the footer when none is given", () => {
    const { container } = render(
      <AuthCard title="Titre" subtitle="Sous-titre">
        <p>Contenu</p>
      </AuthCard>,
    );
    expect(container.querySelector(".text-center")).toBeNull();
  });
});
