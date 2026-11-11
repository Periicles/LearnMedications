"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mergeClasses } from "@/lib/class-names";
import type { NavLinkProps } from "@/types/ui";

const LAYOUT_CLASSES = {
  sidebar: "flex-row gap-3 rounded-2xl border-2 px-4 py-3 text-base",
  tabbar: "flex-1 flex-col gap-0.5 rounded-xl border-2 px-0.5 py-1.5 text-[0.625rem]",
};

export function NavLink({ href, label, layout, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={mergeClasses(
        "flex min-w-0 items-center font-extrabold transition-colors",
        LAYOUT_CLASSES[layout],
        isActive
          ? "border-brand bg-brand-soft text-brand-strong dark:text-brand"
          : "text-ink-soft hover:bg-surface-muted border-transparent",
      )}
    >
      {children}
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
