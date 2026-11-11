import type { EmptyStateProps } from "@/types/ui";

export function EmptyState({ title, description, icon: Icon, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <span className="bg-surface-muted text-ink-soft flex size-16 items-center justify-center rounded-full">
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <p className="text-ink-soft max-w-sm">{description}</p>
      {children}
    </div>
  );
}
