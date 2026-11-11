import { Card } from "@/components/ui/card";
import type { RequestListProps } from "@/types/social";
import { acceptFriendRequest, removeFriendship } from "../actions";
import { FriendAction } from "./friend-action";
import { PersonRow } from "./person-row";

export function RequestList({ title, people, kind }: RequestListProps) {
  if (people.length === 0) return null;

  return (
    <Card>
      <h2 className="text-lg font-black">{title}</h2>
      <ul className="divide-line mt-1 divide-y-2">
        {people.map((person) => (
          <PersonRow key={person.id} person={person}>
            {kind === "received" ? (
              <FriendAction
                friendId={person.id}
                label="Accepter"
                variant="primary"
                action={acceptFriendRequest}
              />
            ) : null}
            <FriendAction
              friendId={person.id}
              label={kind === "received" ? "Refuser" : "Annuler"}
              variant="secondary"
              action={removeFriendship}
            />
          </PersonRow>
        ))}
      </ul>
    </Card>
  );
}
