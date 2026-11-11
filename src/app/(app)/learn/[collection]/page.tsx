import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ROUTES } from "@/constants/routes";
import { requireUser } from "@/features/auth/lib/session";
import { findCollection, getCatalog } from "@/features/content/lib/catalog";
import { LessonPath } from "@/features/learn/components/lesson-path";
import { buildLessonNodes } from "@/features/progress/lib/path";
import { getCompletions } from "@/features/progress/lib/queries";

export default async function CollectionPage(props: PageProps<"/learn/[collection]">) {
  const { collection: collectionSlug } = await props.params;
  const collection = findCollection(collectionSlug);
  if (!collection) notFound();
  const user = await requireUser();
  const nodes = buildLessonNodes(collection, await getCompletions(user.id), getCatalog().areas);
  const completedCount = nodes.filter((node) => node.status === "completed").length;

  return (
    <>
      <Link
        href={ROUTES.learn}
        className="text-brand flex items-center gap-1 text-sm font-extrabold"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Tous les parcours
      </Link>
      <PageHeader
        title={`${collection.icon} ${collection.title}`}
        subtitle={collection.description}
      />
      <div className="flex items-center gap-3">
        <ProgressBar
          value={completedCount}
          total={nodes.length}
          label="Progression du parcours"
          className="flex-1"
        />
        <span className="text-ink-soft text-sm font-extrabold">
          {completedCount}/{nodes.length}
        </span>
      </div>
      <LessonPath collectionSlug={collection.slug} nodes={nodes} />
    </>
  );
}
