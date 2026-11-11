import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { collectionRoute } from "@/constants/routes";
import type { CollectionCardProps } from "@/types/progress";

export function CollectionCard({ progress }: CollectionCardProps) {
  const { collection, completedCount } = progress;
  const lessonCount = collection.lessons.length;

  return (
    <Link
      href={collectionRoute(collection.slug)}
      className="border-line bg-surface hover:border-brand flex h-full flex-col gap-3 rounded-3xl border-2 border-b-4 p-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="bg-surface-muted flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl">
          {collection.icon}
        </span>
        <div className="min-w-0">
          <h3 className="leading-tight font-extrabold">{collection.title}</h3>
          <p className="text-ink-soft text-xs font-bold">
            {collection.substanceSlugs.length} molécules · {completedCount}/{lessonCount} leçons
          </p>
        </div>
      </div>
      <ProgressBar
        value={completedCount}
        total={lessonCount}
        label={`Progression : ${collection.title}`}
        className="mt-auto h-3"
      />
    </Link>
  );
}
