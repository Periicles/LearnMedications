import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { APP_NAME, CONTENT_DISCLAIMER } from "@/constants/app";
import { NAV_ITEMS } from "@/constants/navigation";
import { AppShell } from "./app-shell";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { PageSkeleton } from "./page-skeleton";
import { Sidebar } from "./sidebar";
import { SiteFooter } from "./site-footer";
import { TabBar } from "./tab-bar";
import { TopBar } from "./top-bar";

describe("Logo", () => {
  it("links home and hides the name visually when compact", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByRole("link", { name: APP_NAME })).toHaveAttribute("href", "/");
    expect(screen.getByText(APP_NAME)).not.toHaveClass("sr-only");
    rerender(<Logo compact />);
    expect(screen.getByText(APP_NAME)).toHaveClass("sr-only");
  });
});

describe("NavLink", () => {
  const renderLink = (layout: "sidebar" | "tabbar") =>
    render(
      <NavLink href="/learn" label="Leçons" layout={layout}>
        <Home />
      </NavLink>,
    );

  it("is active on its own path and on nested paths", () => {
    renderLink("sidebar");
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
    vi.mocked(usePathname).mockReturnValueOnce("/learn/essentials");
    renderLink("tabbar");
    expect(screen.getAllByRole("link")[1]).toHaveAttribute("aria-current", "page");
  });

  it("is inactive on other paths, even with a shared prefix", () => {
    vi.mocked(usePathname).mockReturnValue("/learnmore");
    renderLink("tabbar");
    expect(screen.getByRole("link")).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link")).toHaveClass("flex-col");
    vi.mocked(usePathname).mockReturnValue("/learn");
  });
});

describe("navigation containers", () => {
  it("renders every nav item in the sidebar and the tab bar", () => {
    render(
      <>
        <Sidebar />
        <TabBar />
      </>,
    );
    const navs = screen.getAllByRole("navigation", { name: "Navigation principale" });
    expect(navs).toHaveLength(2);
    for (const navigation of navs) {
      expect(
        within(navigation)
          .getAllByRole("link")
          .map((link) => link.getAttribute("href")),
      ).toEqual(expect.arrayContaining(NAV_ITEMS.map((item) => item.href)));
    }
  });
});

describe("page chrome", () => {
  it("composes the shell with its top bar and content", () => {
    render(<AppShell topBar={<TopBar>Barre</TopBar>}>Contenu</AppShell>);
    expect(screen.getByText("Contenu")).toBeInTheDocument();
    expect(screen.getByText("Barre")).toBeInTheDocument();
    expect(screen.getAllByRole("navigation")).toHaveLength(2);
  });

  it("shows the disclaimer in the footer", () => {
    render(<SiteFooter />);
    expect(screen.getByText(CONTENT_DISCLAIMER)).toBeInTheDocument();
  });

  it("announces the loading skeleton", () => {
    render(<PageSkeleton />);
    expect(screen.getByLabelText("Chargement")).toHaveAttribute("aria-busy", "true");
  });
});
