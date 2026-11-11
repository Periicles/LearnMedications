import { Avatar } from "@/components/ui/avatar";
import type { PersonRowProps } from "@/types/social";

export function PersonRow({ person, children }: PersonRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-3 py-2.5">
      <Avatar emoji={person.avatar} size="small" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold">{person.username}</p>
        <p className="text-ink-soft text-xs font-bold">Niveau {person.level}</p>
      </div>
      <div className="flex gap-2">{children}</div>
    </li>
  );
}
