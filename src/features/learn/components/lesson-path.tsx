import { lessonRoute } from "@/constants/routes";
import type { LessonPathProps } from "@/types/progress";
import { LessonNodeView } from "./lesson-node";

export function LessonPath({ collectionSlug, nodes }: LessonPathProps) {
  return (
    <ol className="flex flex-col gap-2.5">
      {nodes.map((node, index) => {
        const startsArea = index === 0 || nodes[index - 1].areaName !== node.areaName;
        return (
          <li key={node.lesson.key} className="flex flex-col gap-2.5">
            {startsArea ? (
              <h2 className="text-ink-soft mt-3 text-sm font-black tracking-wide uppercase">
                {node.areaName}
              </h2>
            ) : null}
            <LessonNodeView
              node={node}
              href={lessonRoute(collectionSlug, node.lesson.key)}
              position={index + 1}
            />
          </li>
        );
      })}
    </ol>
  );
}
