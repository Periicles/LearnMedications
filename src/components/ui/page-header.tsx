import type { PageHeaderProps } from "@/types/ui";

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>
        {subtitle ? <p className="text-ink-soft mt-1 font-semibold">{subtitle}</p> : null}
      </div>
      {children}
    </header>
  );
}
