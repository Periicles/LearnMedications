import { render, screen } from "@testing-library/react";
import { Flame } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button, ButtonLink } from "./button";
import { Card } from "./card";
import { EmptyState } from "./empty-state";
import { FormMessage } from "./form-message";
import { Notice } from "./notice";
import { PageHeader } from "./page-header";
import { ProgressBar } from "./progress-bar";
import { Skeleton } from "./skeleton";
import { StatTile } from "./stat-tile";
import { TextField } from "./text-field";

describe("UI primitives", () => {
  it("renders buttons and links with variants", () => {
    render(
      <>
        <Button variant="danger" fullWidth>
          Delete
        </Button>
        <ButtonLink href="/learn" variant="accent">
          Learn
        </ButtonLink>
      </>,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("w-full", "bg-danger");
    expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute("href", "/learn");
  });

  it("clamps the progress bar and exposes it to assistive tech", () => {
    render(<ProgressBar value={150} total={100} label="Progress" />);
    const progress = screen.getByRole("progressbar", { name: "Progress" });
    expect(progress).toHaveAttribute("aria-valuenow", "100");
    expect(progress.firstElementChild).toHaveStyle({ width: "100%" });
  });

  it("handles an empty progress total", () => {
    render(<ProgressBar value={3} total={0} label="Empty" />);
    expect(screen.getByRole("progressbar").firstElementChild).toHaveStyle({ width: "0%" });
  });

  it("links text fields to their label, hint and error", () => {
    const { rerender } = render(<TextField label="Username" name="username" hint="Visible" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAccessibleDescription("Visible");
    expect(input).toHaveAttribute("aria-invalid", "false");
    rerender(<TextField label="Username" name="username" hint="Visible" error="Taken" />);
    expect(screen.getByLabelText("Username")).toHaveAccessibleDescription("Taken");
    expect(screen.getByLabelText("Username")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders notices with a role matching their tone", () => {
    render(
      <>
        <Notice tone="danger">Broken</Notice>
        <Notice>Saved</Notice>
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Broken");
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("shows form messages only when there is one", () => {
    const { container, rerender } = render(<FormMessage state={{ status: "idle" }} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<FormMessage state={{ status: "success", message: "Done" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Done");
    rerender(<FormMessage state={{ status: "error", message: "Nope" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Nope");
  });

  it("renders the remaining presentational components", () => {
    const { container } = render(
      <>
        <Avatar emoji="💊" size="large" />
        <Badge tone="accent">New</Badge>
        <Card className="extra">Body</Card>
        <Skeleton className="h-4" />
        <StatTile icon={Flame} label="Streak" value={4} tone="danger" />
        <PageHeader title="Title" subtitle="Subtitle">
          <span>Action</span>
        </PageHeader>
        <EmptyState icon={Flame} title="Nothing" description="Come back later">
          <span>Call to action</span>
        </EmptyState>
      </>,
    );
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Body")).toHaveClass("extra");
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nothing" })).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
