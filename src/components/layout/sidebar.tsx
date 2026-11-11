import { Suspense } from "react";
import { NAV_ITEMS } from "@/constants/navigation";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

export function Sidebar() {
  return (
    <aside className="border-line bg-surface sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r-2 p-4 lg:flex">
      <Logo />
      <nav aria-label="Navigation principale" className="flex flex-col gap-1.5">
        <Suspense>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} layout="sidebar">
              <item.icon className="size-6" aria-hidden="true" />
            </NavLink>
          ))}
        </Suspense>
      </nav>
    </aside>
  );
}
