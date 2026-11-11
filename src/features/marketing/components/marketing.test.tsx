import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/constants/app";
import { LANDING_FEATURES } from "../constants";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { HeroPreview } from "./hero-preview";

describe("Hero", () => {
  it("presents the app with sign-up, demo and login links", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(APP_TAGLINE);
    expect(screen.getByText(APP_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Commencer gratuitement" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: "Essayer une leçon" })).toHaveAttribute(
      "href",
      "/demo",
    );
    expect(screen.getByRole("link", { name: "J'ai déjà un compte" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});

describe("HeroPreview", () => {
  it("highlights the right answer and stays hidden from assistive tech", () => {
    const { container } = render(<HeroPreview />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getAllByRole("listitem", { hidden: true })).toHaveLength(4);
    expect(screen.getByText("Paracétamol")).toHaveClass("border-brand");
    expect(screen.getByText("Ibuprofène")).not.toHaveClass("border-brand");
  });
});

describe("FeatureGrid", () => {
  it("lists every landing feature", () => {
    render(<FeatureGrid />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(LANDING_FEATURES.length);
    for (const feature of LANDING_FEATURES) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });
});
