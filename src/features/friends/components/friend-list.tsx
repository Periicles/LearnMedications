import { Card } from "@/components/ui/card";
import type { FriendListProps } from "@/types/social";
import { removeFriendship } from "../actions";
import { FriendAction } from "./friend-action";
import { PersonRow } from "./person-row";

export function FriendList({ friends }: FriendListProps) {
  if (friends.length === 0) return null;

  return (
    <Card>
      <h2 className="text-lg font-black">Mes amis ({friends.length})</h2>
      <ul className="divide-line mt-1 divide-y-2">
        {friends.map((person) => (
          <PersonRow key={person.id} person={person}>
            <FriendAction
              friendId={person.id}
              label="Retirer"
              variant="ghost"
              action={removeFriendship}
            />
          </PersonRow>
        ))}
      </ul>
    </Card>
  );
}
