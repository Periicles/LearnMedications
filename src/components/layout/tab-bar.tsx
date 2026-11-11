import { Suspense } from "react";
import { NAV_ITEMS } from "@/constants/navigation";
import { NavLink } from "./nav-link";

export function TabBar() {
  return (
    <nav
      aria-label="Navigation principale"
      className="border-line bg-surface fixed inset-x-0 bottom-0 z-20 flex gap-0.5 border-t-2 px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <Suspense>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} layout="tabbar" />
        ))}
      </Suspense>
    </nav>
  );
}
