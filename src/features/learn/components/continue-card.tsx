import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { lessonRoute } from "@/constants/routes";
import type { CollectionCardProps } from "@/types/progress";

export function ContinueCard({ progress }: CollectionCardProps) {
  const { collection, nextLesson, completedCount } = progress;
  if (!nextLesson) return null;

  return (
    <Card className="border-brand bg-brand-soft flex flex-col gap-3">
      <p className="text-brand-strong dark:text-brand text-sm font-extrabold">
        {collection.icon} {collection.title} · leçon {completedCount + 1}/
        {collection.lessons.length}
      </p>
      <h2 className="text-2xl font-black">{nextLesson.title}</h2>
      <ButtonLink href={lessonRoute(collection.slug, nextLesson.key)} size="large" fullWidth>
        {completedCount > 0 ? "Continuer" : "Commencer"}
      </ButtonLink>
    </Card>
  );
}
