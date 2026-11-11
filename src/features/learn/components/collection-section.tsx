import type { CollectionSectionProps } from "@/types/progress";
import { CollectionCard } from "./collection-card";

export function CollectionSection({ title, items }: CollectionSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-black">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((progress) => (
          <li key={progress.collection.slug}>
            <CollectionCard progress={progress} />
          </li>
        ))}
      </ul>
    </section>
  );
}
